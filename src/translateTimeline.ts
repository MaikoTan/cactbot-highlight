import * as vscode from "vscode";

import * as path from "path";

import { executeCommand } from "./utils/executeWrapper";

export class TranslatedTimelineProvider implements vscode.TextDocumentContentProvider {

    onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();

    onDidChange = this.onDidChangeEmitter.event;

    async provideTextDocumentContent(uri: vscode.Uri): Promise<string> {
        const filename = uri.path;
        const locale = uri.query;
        const cwd = (vscode.workspace.workspaceFolders as vscode.WorkspaceFolder[])[0].uri.fsPath;
        const pyfile = path.join(cwd, "util/check_translation.py");

        const pythonPath = vscode.workspace.getConfiguration().get("python.pythonPath");
        let pythonBinary = "python3";
        if (typeof pythonPath === "string" && pythonPath) {
            pythonBinary = pythonPath;
        }
        const output =  await executeCommand(pythonBinary, [
            pyfile,
            "-f",
            filename,
            "-t",
            locale,
        ]);
        if (!output.stdout && output.stderr) {
            return output.stderr;
        }
        return output.stdout;
    }
};

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
    if (filename.endsWith(".txt")) {
        filename = filename.replace(".txt", ".js");
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
};
