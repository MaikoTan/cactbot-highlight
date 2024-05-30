/* eslint-disable import/no-named-as-default-member */
import { access, constants, readFile } from 'fs/promises'

import ts from 'typescript'
import { EventEmitter, l10n, languages, TextDocumentContentProvider, Uri, window, workspace } from 'vscode'

import { commonReplacement } from 'cactbot/ui/raidboss/common_replacement'

import { output } from '../utils'

import type { Lang } from 'cactbot/resources/languages'
import type { LocaleText } from 'cactbot/types/trigger'
import type { TimelineReplacement } from 'cactbot/ui/raidboss/timeline_parser'

type CommonReplacement = typeof commonReplacement

const extractReplacements = async (triggerPath: string): Promise<TimelineReplacement[]> => {
  const ret: TimelineReplacement[] = []

  const fileContent = await readFile(triggerPath, 'utf8')

  ts.transform(ts.createSourceFile(triggerPath, fileContent, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TS), [
    (ctx: ts.TransformationContext) => (rootNode: ts.Node) => {
      function visit(node: ts.Node): ts.Node {
        if (ts.isObjectLiteralExpression(node)) {
          const properties = node.properties
          const timelineReplaceNode = properties.find((property) => {
            return ts.isPropertyAssignment(property) && property.name.getText() === 'timelineReplace'
          })
          if (timelineReplaceNode && ts.isPropertyAssignment(timelineReplaceNode)) {
            const timelineReplace = timelineReplaceNode.initializer
            if (ts.isArrayLiteralExpression(timelineReplace)) {
              const timelineReplaceList: TimelineReplacement[] = []
              for (const element of timelineReplace.elements) {
                if (ts.isObjectLiteralExpression(element)) {
                  const localeNode = element.properties.find((property) => {
                    return ts.isPropertyAssignment(property) && property.name.getText() === 'locale'
                  })
                  const replaceSyncNode = element.properties.find((property) => {
                    return ts.isPropertyAssignment(property) && property.name.getText() === 'replaceSync'
                  }) as ts.PropertyAssignment | undefined
                  const replaceTextNode = element.properties.find((property) => {
                    return ts.isPropertyAssignment(property) && property.name.getText() === 'replaceText'
                  }) as ts.PropertyAssignment | undefined
                  if (localeNode && ts.isPropertyAssignment(localeNode) && ts.isStringLiteral(localeNode.initializer)) {
                    const locale = localeNode.initializer.text as keyof LocaleText
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-inner-declarations
                    function resolveSync(node: ts.Node | undefined): TimelineReplacement['replaceSync'] | undefined {
                      if (!node) {
                        return
                      }
                      if (!ts.isObjectLiteralExpression(node)) {
                        return
                      }
                      const syncs = node.properties
                        .map((property) => {
                          if (
                            ts.isPropertyAssignment(property) &&
                            ts.isStringLiteral(property.name) &&
                            ts.isStringLiteral(property.initializer)
                          ) {
                            return [property.name.text, property.initializer.text]
                          }
                        })
                        .filter((sync): sync is [string, string] => !!sync)

                      return Object.fromEntries(syncs)
                    }
                    timelineReplaceList.push({
                      locale,
                      replaceSync: resolveSync(replaceSyncNode?.initializer),
                      replaceText: resolveSync(replaceTextNode?.initializer),
                    })
                  }
                }
              }
              ret.push(...timelineReplaceList)
            }
          }
        }

        return ts.visitEachChild(node, visit, ctx)
      }

      return ts.visitNode(rootNode, visit)
    },
  ])

  return ret
}

export class TranslatedTimelineProvider implements TextDocumentContentProvider {
  onDidChangeEmitter = new EventEmitter<Uri>()

  onDidChange = this.onDidChangeEmitter.event

  async getTriggerFilePath(timelineFilePath: string): Promise<string | undefined> {
    let triggerFilePath = timelineFilePath.replace(/\.txt$/, '.js')
    if (await exist(triggerFilePath)) {
      return triggerFilePath
    }
    triggerFilePath = triggerFilePath.replace(/\.js$/, '.ts')
    if (await exist(triggerFilePath)) {
      return triggerFilePath
    }
  }

  async provideTextDocumentContent(uri: Uri) {
    const timelineFilePath = uri.path
    const triggerFilePath = await this.getTriggerFilePath(timelineFilePath)
    if (!triggerFilePath) {
      throw new Error(l10n.t('Cannot find trigger file.'))
    }

    const locale = uri.query

    try {
      const timelineReplaceList = await extractReplacements(triggerFilePath)
      return this.translate({
        locale: locale as keyof LocaleText,
        timelineFile: String(await readFile(timelineFilePath)),
        timelineReplaceList,
        commonReplace: commonReplacement,
      })
    } catch (e) {
      const err = e as Error
      const ans = await window.showErrorMessage(
        l10n.t('Error when translating file "{0}": {1}\nShow more details?', uri.path, err.name),
        { modal: true },
        l10n.t('Yes'),
        l10n.t('No'),
      )

      output.appendLine(l10n.t('{0}: {1}\n{2}{3}', uri.path, err.name, err.message, err.stack ?? ''))

      if (ans === l10n.t('Yes')) {
        // switch to output panel
        output.show()
      }
    }
  }

  translate(o: {
    locale: keyof LocaleText
    timelineFile: string
    timelineReplaceList: TimelineReplacement[]
    commonReplace: CommonReplacement
  }): string {
    const { locale, timelineFile, timelineReplaceList, commonReplace } = o

    const replace = ((timelineReplaceList: TimelineReplacement[], locale: string): TimelineReplacement | undefined => {
      let replace
      for (const element of timelineReplaceList) {
        if (element.locale === locale) {
          replace = element
          break
        }
      }
      return replace
    })(timelineReplaceList, locale)

    if (!replace) {
      return timelineFile
    }

    const replacedTimeline = timelineFile.split(/\r?\n/).map((timeline: string, index: number) => {
      const line = timeline.trim()
      if (line === '' || line.startsWith('#')) {
        return timeline
      }

      let replacedLine = timeline

      try {
        // match "sync /xxx/"
        const syncMatched = /(?<keyword>sync\s*)\/(?<key>.*?)(?<!\\)\//.exec(line)
        if (syncMatched && replace.replaceSync) {
          let replacedSyncKey = this.replaceKey(syncMatched.groups?.key as string, replace.replaceSync)
          replacedSyncKey = this.replaceCommonKey(replacedSyncKey, commonReplace, 'sync', locale)
          replacedLine = replacedLine.replace(
            syncMatched[0],
            [syncMatched.groups?.keyword, '/', replacedSyncKey, '/'].join(''),
          )
        }

        const matchLogTypeByName = ['AddedCombatant', 'RemovedCombatant']
        const matchLogTypeSource = [
          'StartsUsing',
          'Ability',
          'NetworkAOEAbility',
          'NetworkCancelAbility',
          'NetworkDoT',
          'WasDefeated',
        ]
        const matchLogType = [...matchLogTypeByName, ...matchLogTypeSource, 'GameLog']
        // match net sync like `Action { id: "xxxx" }`
        const netSyncMatched = new RegExp(`(?<keyword>${matchLogType.join('|')})\\s*\\{(?<fields>.*)\\}`).exec(line)
        if (netSyncMatched) {
          const fields = netSyncMatched.groups?.fields
          if (fields) {
            replacedLine = replacedLine.replace(
              netSyncMatched[0],
              [
                netSyncMatched.groups?.keyword,
                ' {',
                this.replaceCommonKey(
                  this.replaceKey(fields, replace.replaceSync ?? {}, true),
                  commonReplace,
                  'sync',
                  locale,
                ),
                '}',
              ].join(''),
            )
          }
        }

        // match "xxxx.x label \"xxxx\""
        const textMatched = /^(?<time>\d+(\.\d)?\s*)(?<label>label\s*)?"(?<text>.*)(?<!\\)"/.exec(line)
        if (textMatched && replace.replaceText) {
          let replacedTextKey = this.replaceKey(textMatched.groups?.text as string, replace.replaceText, false)
          replacedTextKey = this.replaceCommonKey(replacedTextKey, commonReplace, 'text', locale)
          replacedLine = replacedLine.replace(
            textMatched[0],
            [textMatched.groups?.time, textMatched.groups?.label ?? '', '"', replacedTextKey, '"'].join(''),
          )
        }
      } catch (err) {
        const error = err as Error
        throw new Error(
          l10n.t('Error in translating line {0}:\n{1}\n{2}\n{3}', index, error.name, error.message, error.stack ?? ''),
        )
      }

      return replacedLine
    })

    return replacedTimeline.join('\n')
  }

  replaceKey(original: string, replacement: { [x: string]: string }, isGlobal = true): string {
    if (!replacement) {
      return original
    }

    let modifier = 'i'
    if (isGlobal) {
      modifier += 'g'
    }

    let text = original
    for (const [k, v] of Object.entries(replacement)) {
      text = text.replace(new RegExp(k, modifier), v)
    }

    return text
  }

  replaceCommonKey(
    original: string,
    commonReplacement: CommonReplacement,
    key: 'sync' | 'text' = 'sync',
    locale: Lang,
  ): string {
    if (locale === 'en') {
      return original
    }

    let text = original
    const replace = key === 'sync' ? commonReplacement.replaceSync : commonReplacement.replaceText
    for (const [k, v] of Object.entries(replace)) {
      text = text.replace(new RegExp(k, 'gi'), v[locale] ?? '')
    }

    return text
  }
}

export const translatedTimelineProvider = new TranslatedTimelineProvider()

export const translateTimeline = async (): Promise<void> => {
  const document = window.activeTextEditor?.document
  if (!document) {
    return
  }
  let filename = document.fileName

  // TODO: very hacky way
  // maybe it should be the `timelineFile` or `timeline` key in the trigger file
  if (filename.endsWith('.js') || filename.endsWith('.ts')) {
    filename = filename.replace(/\.(js|ts)$/, '.txt')
  }

  // try to get locale settings in settings.json
  let locale = workspace.getConfiguration().get('cactbot.timeline.defaultLocale')

  if (!(typeof locale === 'string' && locale)) {
    locale = (
      await window.showQuickPick(
        [
          {
            label: 'en',
            description: 'English',
            detail: 'English',
          },
          {
            label: 'de',
            description: 'German',
            detail: 'Deutsch',
          },
          {
            label: 'fr',
            description: 'French',
            detail: 'français',
          },
          {
            label: 'ja',
            description: 'Japanese',
            detail: '日本語',
          },
          {
            label: 'cn',
            description: 'Chinese',
            detail: '中文',
          },
          {
            label: 'ko',
            description: 'Korean',
            detail: '한국어',
          },
        ],
        {
          placeHolder: l10n.t('Select a locale...'),
          canPickMany: false,
        },
      )
    )?.label
  }

  if (!locale) {
    return
  }

  const uri = Uri.parse('cactbot-timeline:' + filename + '?' + locale)
  const translatedDocument = await workspace.openTextDocument(uri) // calls back into the provider
  await window.showTextDocument(translatedDocument, { preview: true })
  await languages.setTextDocumentLanguage(translatedDocument, 'cactbot-timeline')

  // FIXME: this should dispose after file close?
  // TODO: not only monitor the current document,
  // but also the related files.
  workspace.onDidChangeTextDocument((e) => {
    if (e.document.fileName.replace(/\.(js|ts|txt)$/, '') === document.fileName.replace(/\.(js|ts|txt)$/, '')) {
      translatedTimelineProvider.onDidChangeEmitter.fire(uri)
    }
  })
}

/**
 * Check if a file or directory exists.
 */
export async function exist(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK)
    return true
  } catch {
    return false
  }
}
