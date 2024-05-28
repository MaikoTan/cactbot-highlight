import { commands, languages, workspace, ExtensionContext } from 'vscode'

import {
  incDecTime,
  runMakeTimeline,
  setTime,
  translatedTimelineProvider,
  translateTimeline,
  TimelineCodeLensProvider,
  TriggerFile,
} from './timeline'

export function activate(context: ExtensionContext): void {
  context.subscriptions.push(
    commands.registerCommand('cactbot.timeline.incDecTime', () => incDecTime()),
    commands.registerCommand('cactbot.timeline.setTime', () => setTime()),

    // register translate timeline
    workspace.registerTextDocumentContentProvider('cactbot-timeline', translatedTimelineProvider),

    commands.registerCommand('cactbot.timeline.translate', () => translateTimeline()),

    languages.registerCodeLensProvider('cactbot-timeline', new TimelineCodeLensProvider()),
    commands.registerCommand('cactbot.timeline.runGenerateScript', (...args) => {
      runMakeTimeline(args)
    }),

    commands.registerCommand('cactbot.timeline.runGenerateScriptWithoutExecution', (...args) => {
      runMakeTimeline(args, false)
    }),

    new TriggerFile(),
  )
}

// export function deactivate() { }
