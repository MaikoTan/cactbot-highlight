import * as vscode from 'vscode'

class TriggerFileTreeDataItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public lineNumber: number,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
  ) {
    super(label, collapsibleState)
  }
}

class TriggerFileTreeDataProvider implements vscode.TreeDataProvider<TriggerFileTreeDataItem> {
  private _localisableRegex = /['"]?en['"]?\s*:\s*['"](?<name>.*?)['"]/
  private _localisedRegex = /['"]?(?<lang>de|fr|ja|cn|ko)['"]?\s*:\s*['"](?<name>.*?)['"](?=,?\s*\n)/g

  private _onDidChangeTreeData: vscode.EventEmitter<TriggerFileTreeDataItem | undefined | void> =
    new vscode.EventEmitter<TriggerFileTreeDataItem | undefined | void>()
  readonly onDidChangeTreeData: vscode.Event<TriggerFileTreeDataItem | undefined | void> =
    this._onDidChangeTreeData.event

  getTreeItem(element: TriggerFileTreeDataItem): vscode.TreeItem {
    return element
  }

  async getChildren(element?: TriggerFileTreeDataItem): Promise<TriggerFileTreeDataItem[]> {
    if (
      !vscode.window.activeTextEditor?.document ||
      !vscode.window.activeTextEditor.document.fileName.endsWith('.ts')
    ) {
      return []
    }

    const activeDocument = vscode.window.activeTextEditor.document
    const dataItems: TriggerFileTreeDataItem[] = []

    if (element) {
      const text = activeDocument.getText(new vscode.Range(element.lineNumber, 0, element.lineNumber + 5, 0))
      const match = text.matchAll(this._localisedRegex)
      if (match) {
        for (const m of match) {
          dataItems.push(new TriggerFileTreeDataItem(m.groups?.name ?? '', 0, vscode.TreeItemCollapsibleState.None))
        }
      }
    } else {
      const text = activeDocument.getText()
      const lines = text.split('\n')

      for (const idx in lines) {
        const line = lines[idx]
        const match = line.match(this._localisableRegex)
        if (match && match.groups?.name) {
          dataItems.push(new TriggerFileTreeDataItem(match.groups.name, Number(idx), vscode.TreeItemCollapsibleState.Collapsed))
        }
      }
    }

    return dataItems
  }
}

export class TriggerFile extends vscode.Disposable {
  private _disposables: vscode.Disposable[] = []

  constructor() {
    super(() => this.dispose())

    this._disposables.push(
      vscode.window.registerTreeDataProvider('cactbot-trigger-localisables', new TriggerFileTreeDataProvider()),
    )
  }

  dispose() {
    for (const disposable of this._disposables) {
      disposable.dispose()
    }
  }
}
