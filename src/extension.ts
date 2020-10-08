// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('cactbot.timeline.adjustTimeline', () => adjustTime());

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}


const adjustTime = () => {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}

	const selection = editor.selection;
	const start = selection.start.line;
	const end = selection.end.line;
	const range = new vscode.Range(editor.document.lineAt(start).range.start, editor.document.lineAt(end).range.end);
	console.log(editor.document.getText(range));

	vscode.window.showInputBox({
		prompt: "input a number (can be negative)",
		validateInput: (value) => {
			return /(-)?\d+(\.\d)?/.test(value) ? null : "please input valid number";
		},
	}).then((value) => {
		if (!value) {
			return;
		}
		const adjust = Number(value);
		
		const originalText = editor.document.getText(range);
		const adjustedText = originalText.split(/\r?\n/).map((text) => {
			const replaced = text.replace(/^(\s*)(\d+(\.\d)?)(\s.*)$/, (replacement, p1, p2, p3, p4) => {
				const time = Number(p2);
				const adjustedTime = time + adjust;
				return p1 + adjustedTime.toString() + p4;
			});
			return replaced;
		});
		editor.edit((editBuilder) => {
			editBuilder.replace(range, adjustedText.join("\n"));
		});
	});
};
