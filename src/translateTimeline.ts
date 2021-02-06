import * as fs from "fs";

import * as vscode from "vscode";
import * as babel from "@babel/core";
import generator from "@babel/generator";
const esmRequire = require("esm")(module, {
  mode: "all",
});
import { NodeVM } from "vm2";

import {
  CommonReplacement,
  Locale, Replacement,
  TimelineReplace,
} from "./models/trigger";

import { commonReplacement } from "./models/common_replacement";

export const sandboxWrapper = async (
  triggerPath: string,
): Promise<{ timelineReplaceList: TimelineReplace[], commonReplacement: CommonReplacement }> => {

  return new Promise((resolve, reject) => {

    const cwd = (vscode.workspace.workspaceFolders as vscode.WorkspaceFolder[])[0].uri.fsPath;

    const vm = new NodeVM({
      sandbox: {
        triggerPath,
        commonPath: cwd + "/ui/raidboss/common_replacement.js",
        babel,
        generator,
        fs,
        esmRequire,
        callback: (timelineReplaceList: TimelineReplace[]) => {
          resolve({ timelineReplaceList, commonReplacement });
        },
      },
      require: {
        external: true,
        builtin: [],
        root: cwd,
      },
    });

    try {
      vm.run(`
let node = null;

babel.traverse(babel.parseSync(String(fs.readFileSync(triggerPath))), {
  ObjectProperty(path) {
    if (path.node.key.name === "timelineReplace") {
      node = path.node;
    }
  }
});

const timelineReplaceCode = generator(node).code.substring("timelineReplace: ".length);
const timelineReplaceJson = eval(timelineReplaceCode);

callback(timelineReplaceJson);
                `, cwd + '/index.js');
    } catch (err) {
      reject(err);
    }
  });
};

export class TranslatedTimelineProvider implements vscode.TextDocumentContentProvider {

  onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();

  onDidChange = this.onDidChangeEmitter.event;

  async provideTextDocumentContent(uri: vscode.Uri): Promise<string> {
    const timelineFilePath = uri.path;
    const triggerFilePath = timelineFilePath.replace(/\.txt$/, ".js");
    const locale = uri.query;

    try {
      const result = await sandboxWrapper(triggerFilePath);
      return this.translate({
        locale: locale as keyof Locale,
        timelineFile: String(fs.readFileSync(timelineFilePath)),
        timelineReplaceList: result.timelineReplaceList,
        commonReplace: result.commonReplacement,
      });
    } catch (e) {
      const err = e as Error;
      return `Error when translating file "${uri.path}":
                ${err.name}
                ${err.message}
                ${err.stack}
            `;
    }
  }

  translate(o: {
    locale: keyof Locale,
    timelineFile: string,
    timelineReplaceList: TimelineReplace[],
    commonReplace: CommonReplacement,
  }): string {
    const {
      locale,
      timelineFile,
      timelineReplaceList,
      commonReplace,
    } = o;

    const replace = ((timelineReplaceList: TimelineReplace[], locale: string): TimelineReplace | undefined => {
      let replace;
      for (const element of timelineReplaceList) {
        if (element.locale === locale) {
          replace = element;
          break;
        }
      }
      return replace;
    })(timelineReplaceList, locale);

    if (!replace) {
      return timelineFile;
    }

    const replacedTimeline = timelineFile.split(/\r?\n/).map((timeline: string, index: number) => {
      const line = timeline.trim();
      if (line === "" || line.startsWith("#")) {
        return timeline;
      }

      let replacedLine = timeline;

      try {
        // match "sync /xxx/"
        const syncMatched = /(?<keyword>sync\s*)\/(?<key>.*?)(?<!\\)\//.exec(line);
        if (syncMatched) {
          let replacedSyncKey = this.replaceKey(syncMatched.groups?.key as string, replace.replaceSync);
          replacedSyncKey = this.replaceCommonKey(replacedSyncKey, commonReplace, "sync", locale);
          replacedLine = replacedLine.replace(syncMatched[0], [
            syncMatched.groups?.keyword,
            "/",
            // replace / to \/
            replacedSyncKey.replace(/\//g, "\\/"),
            "/",
          ].join(""));
        }

        // match "xxxx.x \"xxxx\""
        const textMatched = /^(?<time>\d+(\.\d)?\s*)"(?<text>.*)(?<!\\)"/.exec(line);
        if (textMatched) {
          let replacedTextKey = this.replaceKey(textMatched.groups?.text as string, replace.replaceText, false);
          replacedTextKey = this.replaceCommonKey(replacedTextKey, commonReplace, "text", locale);
          replacedLine = replacedLine.replace(textMatched[0], [
            textMatched.groups?.time,
            "\"",
            // replace " to \"
            replacedTextKey.replace(/"/g, "\\\""),
            "\"",
          ].join(""));
        }
      } catch (err) {
        const error = err as Error;
        console.warn(`Error in translating line ${index}:
                    ${error.name}
                    ${error.message}
                    ${error.stack}
                `);
      }

      return replacedLine;
    });

    return replacedTimeline.join("\n");
  }

  replaceKey(original: string, replacement: Replacement, isGlobal: boolean = true): string {
    if (!replacement) {
      return original;
    }

    let modifier = "i";
    if (isGlobal) {
      modifier += "g";
    }

    let text = original;
    for (const [k, v] of Object.entries(replacement)) {
      text = text.replace(new RegExp(k, modifier), v);
    }

    return text;
  }

  replaceCommonKey(
    original: string,
    commonReplacement: CommonReplacement,
    key: "sync" | "text" = "sync",
    locale: keyof Locale,
  ): string {
    if (locale === "en") {
      return original;
    }

    let text = original;
    const replace = (key === "sync") ? commonReplacement.replaceSync : commonReplacement.replaceText;
    for (const [k, v] of Object.entries(replace)) {
      text = text.replace(new RegExp(k, "gi"), v[locale]);
    }

    return text;
  }
};

export const translatedTimelineProvider = new TranslatedTimelineProvider();

export const translateTimeline = async () => {
  const document = vscode.window.activeTextEditor?.document;
  if (!document) {
    return;
  }
  let filename = document.fileName;
  if (!/\w*ui.raidboss.data.\d\d.*\.(js|txt)/.test(filename)) {
    await vscode.window.showErrorMessage(
      `${filename} is not a valid file path, please make sure your active file is "ui/raidboss/data/**/*.js"`
    );
    return;
  }

  // TODO: very hacky way
  // maybe it should be the `timelineFile` or `timeline` key in the trigger file
  if (filename.endsWith(".js")) {
    filename = filename.replace(/\.js$/, ".txt");
  }

  // try to get locale settings in settings.json
  let locale = vscode.workspace.getConfiguration().get("cactbot.timeline.defaultLocale");

  if (!(typeof locale === "string" && locale)) {
    locale = await vscode.window.showQuickPick(
      [
        {
          label: 'de',
          description: 'German',
          detail: 'Deutsch',
        },
        {
          label: 'fr',
          description: 'French',
          detail: 'français',
        },
        {
          label: 'ja',
          description: 'Japanese',
          detail: '日本語',
        },
        {
          label: 'cn',
          description: 'Chinese',
          detail: '中文',
        },
        {
          label: 'ko',
          description: 'Korean',
          detail: '한국어',
        },
      ],
      {
        placeHolder: 'Input a locale...',
        canPickMany: false,
      }
    );
  }

  if (!locale) {
    return;
  }

  const uri = vscode.Uri.parse('cactbot-timeline:' + filename + "?" + (locale as vscode.QuickPickItem).label);
  const translatedDocument = await vscode.workspace.openTextDocument(uri); // calls back into the provider
  await vscode.window.showTextDocument(translatedDocument, { preview: true });
  await vscode.languages.setTextDocumentLanguage(translatedDocument, "cactbot-timeline");

  // FIXME: this should dispose after file close?
  // TODO: not only monitor the current document,
  // but also the related files.
  vscode.workspace.onDidChangeTextDocument((e) => {
    if (e.document.fileName.replace(/\.(js|txt)$/, '') === document.fileName.replace(/\.(js|txt)$/, '')) {
      translatedTimelineProvider.onDidChangeEmitter.fire(uri);
    }
  });
};
