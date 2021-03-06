import { readFile } from "fs";

import { EventEmitter, languages, TextDocumentContentProvider, Uri, window, workspace } from "vscode";
import { parseAsync, traverse } from "@babel/core";
import { isArrayExpression, isIdentifier, isObjectExpression, isObjectProperty, isStringLiteral } from "@babel/types";
import { promisify } from "bluebird";

import {
  CommonReplacement,
  Locale, Replacement,
  TimelineReplace,
} from "../models/trigger";

import { commonReplacement } from "../models/common_replacement";

export const extractReplacements = async (
  triggerPath: string,
): Promise<TimelineReplace[]> => {

  const ret: TimelineReplace[] = [];
  traverse(await parseAsync(String(await promisify(readFile)(triggerPath))), {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ObjectProperty(path) {
      const node = path.node;
      if (isIdentifier(node.key) &&
        node.key.name === "timelineReplace" &&
        isArrayExpression(node.value)) {
        node.value.elements.forEach((element) => {
          if (!isObjectExpression(element)) { return; }
          const timelineReplace: TimelineReplace = {
            locale: "en",
            replaceSync: {},
            replaceText: {},
          };
          element.properties.forEach((locales) => {
            if (!isObjectProperty(locales)) { return; }
            const name = isStringLiteral(locales.key) ? locales.key.value : isIdentifier(locales.key) ? locales.key.name : null;
            if (name === "locale" && isStringLiteral(locales.value)) {
              timelineReplace.locale = locales.value.value as keyof Locale;
            }
            if (name === "replaceSync" && isObjectExpression(locales.value)) {
              locales.value.properties.forEach((prop) => {
                if (!isObjectProperty(prop)) { return; }
                const { key, value } = prop;
                if (!isStringLiteral(key) || !isStringLiteral(value)) { return; }
                timelineReplace.replaceSync[key.value] = value.value;
              });
            }
            if (name === "replaceText" && isObjectExpression(locales.value)) {
              locales.value.properties.forEach((prop) => {
                if (!isObjectProperty(prop)) { return; }
                const { key, value } = prop;
                if (!isStringLiteral(key) || !isStringLiteral(value)) { return; }
                timelineReplace.replaceText[key.value] = value.value;
              });
            }
          });
          ret.push(timelineReplace);
        });
      }
    },
  });

  return ret;
};

export class TranslatedTimelineProvider implements TextDocumentContentProvider {

  onDidChangeEmitter = new EventEmitter<Uri>();

  onDidChange = this.onDidChangeEmitter.event;

  async provideTextDocumentContent(uri: Uri): Promise<string> {
    const timelineFilePath = uri.path;
    const triggerFilePath = timelineFilePath.replace(/\.txt$/, ".js");
    const locale = uri.query;

    try {
      const timelineReplaceList = await extractReplacements(triggerFilePath);
      return this.translate({
        locale: locale as keyof Locale,
        timelineFile: String(await promisify(readFile)(timelineFilePath)),
        timelineReplaceList,
        commonReplace: commonReplacement,
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

  replaceKey(original: string, replacement: Replacement, isGlobal = true): string {
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
}

export const translatedTimelineProvider = new TranslatedTimelineProvider();

export const translateTimeline = async (): Promise<void> => {
  const document = window.activeTextEditor?.document;
  if (!document) {
    return;
  }
  let filename = document.fileName;
  if (!/\w*ui.raidboss.data.\d\d.*\.(js|txt)/.test(filename)) {
    await window.showErrorMessage(
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
  let locale = workspace.getConfiguration().get("cactbot.timeline.defaultLocale");

  if (!(typeof locale === "string" && locale)) {
    locale = (await window.showQuickPick(
      [
        {
          label: "en",
          description: "English",
          detail: "English",
        },
        {
          label: "de",
          description: "German",
          detail: "Deutsch",
        },
        {
          label: "fr",
          description: "French",
          detail: "français",
        },
        {
          label: "ja",
          description: "Japanese",
          detail: "日本語",
        },
        {
          label: "cn",
          description: "Chinese",
          detail: "中文",
        },
        {
          label: "ko",
          description: "Korean",
          detail: "한국어",
        },
      ],
      {
        placeHolder: "Select a locale...",
        canPickMany: false,
      }
    ))?.label;
  }

  if (!locale) {
    return;
  }

  const uri = Uri.parse("cactbot-timeline:" + filename + "?" + locale);
  const translatedDocument = await workspace.openTextDocument(uri); // calls back into the provider
  await window.showTextDocument(translatedDocument, { preview: true });
  await languages.setTextDocumentLanguage(translatedDocument, "cactbot-timeline");

  // FIXME: this should dispose after file close?
  // TODO: not only monitor the current document,
  // but also the related files.
  workspace.onDidChangeTextDocument((e) => {
    if (e.document.fileName.replace(/\.(js|txt)$/, "") === document.fileName.replace(/\.(js|txt)$/, "")) {
      translatedTimelineProvider.onDidChangeEmitter.fire(uri);
    }
  });
};
