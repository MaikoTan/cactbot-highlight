import { exec } from 'child_process'
import { promisify } from 'util'

import * as vscode from 'vscode'

import { output } from '../utils'

export class TimelineCodeLensProvider implements vscode.CodeLensProvider {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  AVAILABLE_ARGUMENTS = ['-ii', '-ia', '-ic', '-oc', '-p', '-it'].map((arg) => `# ${arg}`)

  provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
    const codeLenses = []
    for (let i = 0; i < document.lineCount; i++) {
      const line = document.lineAt(i)
      if (this.AVAILABLE_ARGUMENTS.some((arg) => line.text.startsWith(arg))) {
        const siblings = []
        let j = i + 1
        while (
          j < document.lineCount &&
          this.AVAILABLE_ARGUMENTS.some((arg) => document.lineAt(j).text.startsWith(arg))
        ) {
          siblings.push(document.lineAt(j).text)
          j++
        }
        const range = new vscode.Range(i, 0, j - 1, document.lineAt(j - 1).text.length)
        const args = siblings.map((sibling) => sibling.trim().replace(/^#\s*/g, ''))
        codeLenses.push(
          new vscode.CodeLens(range, {
            command: 'cactbot.timeline.runGenerateScript',
            title: vscode.l10n.t('run make_timeline'),
            tooltip: vscode.l10n.t('Run `make_timeline` command'),
            arguments: args,
          }),
        )
        codeLenses.push(
          new vscode.CodeLens(range, {
            command: 'cactbot.timeline.runGenerateScriptWithoutExecution',
            title: vscode.l10n.t('send make_timeline'),
            tooltip: vscode.l10n.t('Send `make_timeline` command to terminal without execution'),
            arguments: args,
          }),
        )
        i = j - 1
      }
    }
    return codeLenses
  }
}

export async function runMakeTimeline(args: IArguments[], run = true): Promise<void> {
  const file = await vscode.window.showOpenDialog({
    canSelectFiles: true,
    canSelectFolders: false,
    canSelectMany: false,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    filters: { 'Log File': ['log'] },
  })

  if (!file) {
    return
  }

  const _command = vscode.workspace.getConfiguration().get('cactbot.timeline.makeTimelineCommandTemplate') as string
  if (!_command) {
    vscode.window.showErrorMessage(vscode.l10n.t('{0} is not set', 'cactbot.timeline.makeTimelineCommandTemplate'))
    return
  }

  const command = _command.replace(/\$FILE/g, file[0].fsPath).replace(/\$ARGUMENTS/g, args.join(' '))
  if (run) {
    try {
      const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath
      const res = await promisify(exec)(command, { cwd: rootPath })

      // create a new document aside from the current one
      const doc = await vscode.workspace.openTextDocument()
      const editor = await vscode.window.showTextDocument(doc, { preview: true, viewColumn: vscode.ViewColumn.Beside })
      await editor.edit((edit) => {
        edit.insert(new vscode.Position(0, 0), res.stdout)
      })
    } catch (e) {
      vscode.window.showErrorMessage((e as Error).message)
      // show error in output panel
      output.appendLine(vscode.l10n.t('Errors occurred while running make_timeline:'))
      output.appendLine((e as Error).message)
      output.appendLine('')
    }
  } else {
    const terminal = vscode.window.createTerminal('cactbot-timeline')
    terminal.show()
    await new Promise((resolve) => setTimeout(resolve, 500))
    terminal.sendText(command)
  }
}
