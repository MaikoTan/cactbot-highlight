import * as vscode from "vscode";

const LOCALE_REGEX = /(?<=\s)(?<locale>en|de|fr|ja|cn|ko): .*?/;

type LocaleKeys = "en" | "de" | "fr" | "ja" | "cn" | "ko";

const localeOrder = {
    "en": 0,
    "de": 1,
    "fr": 2,
    "ja": 3,
    "cn": 4,
    "ko": 5,
};


export function refreshDiagnostics(doc: vscode.TextDocument, triggerDiagnostic: vscode.DiagnosticCollection): void {
    const filename = doc.fileName;
    // only diagnost cactbot/ui/raidboss/data/**.js
    if (!/\w*ui.raidboss.data.\d\d.*\.(js|txt)/.test(filename)) {
        return;
    }

    const diagnostics: vscode.Diagnostic[] = [];

    for (let lineIndex = 0; lineIndex < doc.lineCount; lineIndex++) {
        const lineOfText = doc.lineAt(lineIndex);
        if (LOCALE_REGEX.test(lineOfText.text)) {
            const locale = LOCALE_REGEX.exec(lineOfText.text)?.groups?.locale as LocaleKeys;
            if (lineIndex <= 0 || !locale) {
                continue;
            }

            const previousLineText = doc.lineAt(lineIndex - 1).text;
            const preMatched = LOCALE_REGEX.exec(previousLineText);
            if (preMatched && preMatched?.groups?.locale) {
                const preLocale = preMatched?.groups?.locale as LocaleKeys;
                if (localeOrder[locale] < localeOrder[preLocale]) {
                    diagnostics.push({
                        message: `${locale} should be before ${preMatched?.groups?.locale}. (Recommanded order is [${Object.keys(localeOrder).join(", ")}])`,
                        range: new vscode.Range(lineIndex, lineOfText.text.indexOf(locale), lineIndex, lineOfText.text.length),
                        severity: vscode.DiagnosticSeverity.Warning,
                    });
                }
            }
        }
    }

    triggerDiagnostic.set(doc.uri, diagnostics);
}

export function subscribeToDocumentChanges(context: vscode.ExtensionContext, triggerDiagnostic: vscode.DiagnosticCollection): void {
    if (vscode.window.activeTextEditor) {
        refreshDiagnostics(vscode.window.activeTextEditor.document, triggerDiagnostic);
    }
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor) {
                refreshDiagnostics(editor.document, triggerDiagnostic);
            }
        })
    );

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(e => refreshDiagnostics(e.document, triggerDiagnostic))
    );

    context.subscriptions.push(
        vscode.workspace.onDidCloseTextDocument(doc => triggerDiagnostic.delete(doc.uri))
    );
}