// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { commands, workspace, ExtensionContext } from "vscode";

import {
	adjustTimeByNumber,
	adjustTimeToNumber,
	translatedTimelineProvider,
	translateTimeline,
} from "./timeline";
import { LocaleCodeLens } from "./trigger/localeCodeLens";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext): void {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	context.subscriptions.push(commands.registerCommand("cactbot.timeline.adjustTimelineByNumber", () => adjustTimeByNumber()));
	context.subscriptions.push(commands.registerCommand("cactbot.timeline.adjustTimelineToNumber", () => adjustTimeToNumber()));

	// register translate timeline
	context.subscriptions.push(workspace.registerTextDocumentContentProvider("cactbot-timeline", translatedTimelineProvider));
	context.subscriptions.push(commands.registerCommand("cactbot.timeline.translateTimeline", () => translateTimeline()));

}

// this method is called when your extension is deactivated
// export function deactivate() { }
