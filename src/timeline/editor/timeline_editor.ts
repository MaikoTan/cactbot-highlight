import * as vscode from "vscode";

export class TimelineEditorProvider implements vscode.CustomTextEditorProvider {
  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new TimelineEditorProvider(context);
    const providerRegistration = vscode.window.registerCustomEditorProvider(TimelineEditorProvider.viewType, provider);
    return providerRegistration;
  }

  public static readonly viewType = "cactbot.timeline.editor";

  constructor(private readonly context: vscode.ExtensionContext) {}

  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    token: vscode.CancellationToken,
  ): Promise<void> {
    const webview = webviewPanel.webview;
    webview.options = {
      enableScripts: true,
    };
    webview.html = this.getWebviewContent(document);

    // Hook up event handlers to make sure the webview content
    // is synchronized with the text document.
    const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument((e) => {
      if (e.document.uri.toString() === document.uri.toString()) {
        this.updateWebview(webviewPanel, document);
      }
    });

    webviewPanel.onDidDispose(() => {
      changeDocumentSubscription.dispose();
    });
  }

  private updateWebview(webview: vscode.WebviewPanel, document: vscode.TextDocument) {
    webview.webview.postMessage({
      command: "update",
      text: document.getText(),
    });
  }

  /**
   * Write out to the file
   */
  private updateTextDocument(document: vscode.TextDocument, range: vscode.Range, content: string) {
    const edit = new vscode.WorkspaceEdit();
    edit.replace(document.uri, range, content);
    return vscode.workspace.applyEdit(edit);
  }

  private getWebviewContent(document: vscode.TextDocument): string {
    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Timeline Editor</title>
    </head>
    <body>
        <div id="root"></div>
    </body>
    </html>`;
    return html;
  }
}
