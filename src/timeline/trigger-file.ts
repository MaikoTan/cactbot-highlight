/* eslint-disable import/no-named-as-default-member */
import ts from 'typescript'
import * as vscode from 'vscode'
import * as nls from 'vscode-nls'

import { output } from '../utils'

import type { LocaleObject } from 'cactbot/types/trigger'

const localize = nls.loadMessageBundle()

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
  private _activeDocument: vscode.TextDocument | undefined
  private _localeTextItems: Record<string, LocaleObject<TriggerFileTreeDataItem>> = {}

  private _onDidChangeTreeData: vscode.EventEmitter<TriggerFileTreeDataItem | undefined | void> =
    new vscode.EventEmitter<TriggerFileTreeDataItem | undefined | void>()
  readonly onDidChangeTreeData: vscode.Event<TriggerFileTreeDataItem | undefined | void> =
    this._onDidChangeTreeData.event

  constructor() {
    this._activeDocument = vscode.window.activeTextEditor?.document
    vscode.window.onDidChangeActiveTextEditor(() => this._refresh())
    vscode.workspace.onDidChangeTextDocument(() => this._refresh())
  }

  private async _refresh(): Promise<void> {
    this._activeDocument = vscode.window.activeTextEditor?.document
    if (!this._activeDocument) {
      this._localeTextItems = {}
    } else {
      try {
        await this._parseTriggerFile()
      } catch (e) {
        if (e instanceof Error) {
          output.appendLine(localize('{0}: {1}\n{2}', e.name, e.message, e.stack))
        }
        /* noop */
      }
    }
    this._onDidChangeTreeData.fire()
  }

  getTreeItem(element: TriggerFileTreeDataItem): vscode.TreeItem {
    return element
  }

  async getChildren(element?: TriggerFileTreeDataItem): Promise<TriggerFileTreeDataItem[]> {
    if (this._activeDocument && Object.keys(this._localeTextItems).length === 0) {
      await this._refresh()
    }

    if (element) {
      const key = element.label
      const localeText = this._localeTextItems[key]
      if (localeText) {
        return Object.values(localeText)
      }

      return []
    } else {
      return Object.keys(this._localeTextItems).map((key) => {
        const en = this._localeTextItems[key].en
        return new TriggerFileTreeDataItem(key, en?.lineNumber ?? 0, vscode.TreeItemCollapsibleState.Collapsed)
      })
    }
  }

  async _parseTriggerFile(): Promise<void> {
    if (!this._activeDocument?.fileName?.endsWith('.ts')) {
      return
    }

    const activeDocument = this._activeDocument
    const text = activeDocument.getText()

    ts.transform(ts.createSourceFile(activeDocument.uri.fsPath, text, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TS), [
      (ctx: ts.TransformationContext) => (rootNode: ts.Node) => {
        const visit = (node: ts.Node): ts.Node => {
          if (ts.isObjectLiteralExpression(node)) {
            const properties = node.properties
            if (properties.length === 0) {
              return node
            }
            // Check if the object is a locale object (has a 'en' property)
            const enProperty = properties.find(
              (prop) => ts.isPropertyAssignment(prop) && prop.name.getText() === 'en',
            ) as ts.PropertyAssignment | undefined
            if (!enProperty) {
              // If the object is not a locale object, visit its children
              return ts.visitEachChild(node, visit, ctx)
            }

            const parent = node.parent
            let key = localize('trigger.identifier.unknown', 'Unknown')
            // Try to get the key or identifier of the object
            //
            // VariableDeclaration:
            // const key = { en: 'value', ... }
            // PropertyAssignment:
            // { key: { en: 'value', ... } }
            if (ts.isVariableDeclaration(parent) || ts.isPropertyAssignment(parent)) {
              key = parent.name.getText()
            }

            // Get all the locale properties
            const localeProperties = properties.filter(
              (prop) => ts.isPropertyAssignment(prop) && prop.name.getText() !== 'en',
            ) as ts.PropertyAssignment[]

            // Construct the locale object
            const localeObject: Partial<LocaleObject<TriggerFileTreeDataItem>> = {}
            for (const prop of localeProperties) {
              if (typeof prop.name === 'undefined' || typeof prop.initializer === 'undefined') {
                continue
              }
              const name = prop.name.getText()
              const value = prop.initializer.getText()
              const lineNumber = prop.getStart()
              localeObject[name as keyof LocaleObject<unknown>] = new TriggerFileTreeDataItem(
                value,
                lineNumber,
                vscode.TreeItemCollapsibleState.None,
              )
            }

            // Construct the en object
            const en = enProperty.initializer.getText()
            const lineNumber = enProperty.getStart()
            localeObject.en = new TriggerFileTreeDataItem(en, lineNumber, vscode.TreeItemCollapsibleState.None)

            this._localeTextItems[key] = localeObject as LocaleObject<TriggerFileTreeDataItem>
          }

          return ts.visitEachChild(node, visit, ctx)
        }

        return ts.visitNode(rootNode, visit)
      },
    ])
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
