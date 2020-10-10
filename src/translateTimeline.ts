import * as path from "path";
import * as fs from "fs";

import * as vscode from "vscode";
import { NodeVM } from "vm2";

import {
    CommonReplacementModule,
    Locale, Replacement,
    TimelineReplace,
    TriggerFile
} from "./models/trigger";

export const sandboxWrapper = async (
    triggerPath: string,
): Promise<{ triggerFile: TriggerFile, commonReplacement: CommonReplacementModule }> => {

    return new Promise((resolve, reject) => {

        const cwd = (vscode.workspace.workspaceFolders as vscode.WorkspaceFolder[])[0].uri.fsPath;
        const triggerText = String(fs.readFileSync(triggerPath));

        const absolute = (filePath: string): string => {
            return path.join(cwd, filePath);
        };

        const vm = new NodeVM({
            sandbox: {
                conditionsPath: absolute("resources/conditions.js"),
                regexesPath: absolute("resources/regexes.js"),
                netregexesPath: absolute("resources/netregexes.js"),
                responsesPath: absolute("resources/responses.js"),
                zoneIdPath: absolute("resources/zone_id.js"),
                commonReplacementPath: absolute("ui/raidboss/common_replacement.js"),
                triggerText,
                callback: (triggerFile: TriggerFile, commonReplacement: CommonReplacementModule) => {
                    resolve({ triggerFile, commonReplacement });
                },
            },
            require: {
                external: true,
                builtin: ['fs', 'path'],
                root: cwd,
            }
        });

        try {
            vm.run(`
                    const Conditions = require(conditionsPath);
                    const Regexes = require(regexesPath);
                    const NetRegexes = require(netregexesPath);
                    const ZoneId = require(zoneIdPath);
                    const Responses = require(responsesPath).responses;
                    const commonReplacement = require(commonReplacementPath);
                    var trigger = eval(triggerText);
                    callback(trigger[0], commonReplacement);
                `);
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
                triggerFile: result.triggerFile,
                commonReplaceModule: result.commonReplacement,
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
        triggerFile: TriggerFile,
        commonReplaceModule: CommonReplacementModule,
    }): string {
        const {
            locale,
            timelineFile,
            triggerFile,
            commonReplaceModule,
        } = o;

        const replace = ((triggerFile: TriggerFile, locale: string): TimelineReplace | undefined => {
            let replace;
            if (!(triggerFile && triggerFile?.timelineReplace)) {
                return undefined;
            }
            for (const element of triggerFile.timelineReplace) {
                if (element.locale === locale) {
                    replace = element;
                    break;
                }
            }
            return replace;
        })(triggerFile, locale);

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
                const syncMatched = /(?<keyword>sync\s*)\/(?<key>.*)(?<!\\)\//.exec(line);
                if (syncMatched) {
                    let replacedSyncKey = this.replaceKey(syncMatched.groups?.key as string, replace.replaceSync);
                    replacedSyncKey = this.replaceCommonKey(replacedSyncKey, commonReplaceModule, "sync", locale);
                    replacedLine = replacedLine.replace(syncMatched[0], [
                        syncMatched.groups?.keyword,
                        "/",
                        replacedSyncKey.replace("/", "\/"),
                        "/",
                    ].join(""));
                }
    
                // match "xxxx.x \"xxxx\""
                const textMatched = /^(?<time>\d+(\.\d)?\s*)"(?<text>.*)(?<!\\)"/.exec(line);
                if (textMatched) {
                    let replacedTextKey = this.replaceKey(textMatched.groups?.text as string, replace.replaceText, false);
                    replacedTextKey = this.replaceCommonKey(replacedTextKey, commonReplaceModule, "text", locale);
                    replacedLine = replacedLine.replace(textMatched[0], [
                        textMatched.groups?.time,
                        "\"",
                        replacedTextKey.replace("\"", "\/"),
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
        commonReplacementModule: CommonReplacementModule,
        key: "sync" | "text" = "sync",
        locale: keyof Locale,
    ): string {
        if (locale === "en") {
            return original;
        }

        let text = original;
        const replace = (key === "sync") ? commonReplacementModule.commonReplacement.replaceSync : commonReplacementModule.commonReplacement.replaceText;
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
    if (filename.endsWith(".js")) {
        filename = filename.replace(/\.js$/, ".txt");
    }

    // try to get locale settings in settings.json
    let locale = vscode.workspace.getConfiguration().get("cactbot.timeline.defaultLocale");

    if (!(typeof locale === "string" && locale)) {
        locale = await vscode.window.showInputBox({
            placeHolder: 'Input a locale...',
            validateInput: (value) => {
                const validLocales = ["de", "fr", "ja", "cn", "ko"];
                if (validLocales.includes(value)) {
                    return null;
                }
                return `Locale should be one of [${validLocales.join(", ")}]`;
            }
        });
    }

    if (!locale) {
        return;
    }

    const uri = vscode.Uri.parse('cactbot-timeline:' + filename + "?" + locale);
    const translatedDocument = await vscode.workspace.openTextDocument(uri); // calls back into the provider
    await vscode.window.showTextDocument(translatedDocument, { preview: false });
    await vscode.languages.setTextDocumentLanguage(translatedDocument, "cactbot-timeline");

    vscode.workspace.onDidChangeTextDocument((e) => {
        if (e.document === document) {
            translatedTimelineProvider.onDidChangeEmitter.fire(uri);
        }
    });
};
