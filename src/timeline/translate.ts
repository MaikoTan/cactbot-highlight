import { availablePlugins, registerPlugin, transform } from '@babel/standalone'
import { isArrayExpression, isIdentifier, isObjectExpression, isObjectProperty, isStringLiteral } from '@babel/types'
import { EventEmitter, languages, TextDocumentContentProvider, Uri, window, workspace } from 'vscode'
import * as nls from 'vscode-nls/browser'
import { URI } from 'vscode-uri'

import { commonReplacement } from 'cactbot/ui/raidboss/common_replacement'

import type { PluginObj } from '@babel/core'
import type { Lang } from 'cactbot/resources/languages'
import type { LocaleText } from 'cactbot/types/trigger'
import type { TimelineReplacement } from 'cactbot/ui/raidboss/timeline_parser'

type CommonReplacement = typeof commonReplacement

const localize = nls.loadMessageBundle()

export const extractReplacements = async (triggerPath: string): Promise<TimelineReplacement[]> => {
  const ret: TimelineReplacement[] = []

  const fileContent = (await workspace.fs.readFile(URI.file(triggerPath))).toString()

  if (!availablePlugins.extractReplacements) {
    registerPlugin('extractReplacements', extractReplacementsPluginWrapper(ret))
  }
  const babelRet = await transform(fileContent, { plugins: ['@babel/plugin-transform-typescript', 'extractReplacements'] })
  if (!babelRet) {
    throw new Error(localize('error.babel.transpile', 'Error when reading trigger file: {0}', triggerPath))
  }

  return ret
}

export class TranslatedTimelineProvider implements TextDocumentContentProvider {
  onDidChangeEmitter = new EventEmitter<Uri>()

  onDidChange = this.onDidChangeEmitter.event

  async getTriggerFilePath(timelineFilePath: string): Promise<string | undefined> {
    let triggerFilePath = timelineFilePath.replace(/\.txt$/, '.js')
    try {
      await workspace.fs.stat(URI.file(triggerFilePath))
      return triggerFilePath
    } catch (err) {
      try {
        triggerFilePath = triggerFilePath.replace(/\.js$/, '.ts')
        return triggerFilePath
      } catch (err) {
        return undefined
      }
    }
  }

  async provideTextDocumentContent(uri: Uri): Promise<string> {
    const timelineFilePath = uri.path
    const triggerFilePath = await this.getTriggerFilePath(timelineFilePath)
    if (!triggerFilePath) {
      throw new Error(localize('error.trigger.notfound', 'Cannot find trigger file.'))
    }

    const locale = uri.query

    try {
      const timelineReplaceList = await extractReplacements(triggerFilePath)
      return this.translate({
        locale: locale as keyof LocaleText,
        timelineFile: (await workspace.fs.readFile(URI.file(timelineFilePath))).toString(),
        timelineReplaceList,
        commonReplace: commonReplacement,
      })
    } catch (e) {
      const err = e as Error
      return localize(
        'error.timeline.translate.stack',
        'Error when translating file "{0}":\n{1}\n{2}\n{3}',
        uri.path,
        err.name,
        err.message,
        err.stack,
      )
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
            [
              syncMatched.groups?.keyword,
              '/',
              // replace / to \/
              replacedSyncKey.replace(/\//g, '\\/'),
              '/',
            ].join(''),
          )
        }

        // match "xxxx.x \"xxxx\""
        const textMatched = /^(?<time>\d+(\.\d)?\s*)"(?<text>.*)(?<!\\)"/.exec(line)
        if (textMatched && replace.replaceText) {
          let replacedTextKey = this.replaceKey(textMatched.groups?.text as string, replace.replaceText, false)
          replacedTextKey = this.replaceCommonKey(replacedTextKey, commonReplace, 'text', locale)
          replacedLine = replacedLine.replace(
            textMatched[0],
            [
              textMatched.groups?.time,
              '"',
              // replace " to \"
              replacedTextKey.replace(/"/g, '\\"'),
              '"',
            ].join(''),
          )
        }
      } catch (err) {
        const error = err as Error
        console.warn(
          localize(
            'error.transle.line.stack',
            'Error in translating line {0}:\n{1}\n{2}\n{3}',
            index,
            error.name,
            error.message,
            error.stack,
          ),
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
  if (!/\w*ui.raidboss.data.\d\d.*\.(ts|js|txt)/.test(filename)) {
    await window.showErrorMessage(
      localize(
        'error.timeline.file.not.valid',
        '{0} is not a valid file path, please make sure the path of your active file is "ui/raidboss/data/**/*.(js|ts)"',
        filename,
      ),
    )
    return
  }

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
          placeHolder: localize('translate.locale.prompt', 'Select a locale...'),
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

const extractReplacementsPluginWrapper: (ret: TimelineReplacement[]) => PluginObj = (ret) => {
  return {
    visitor: {
      ObjectProperty(path) {
        const node = path.node
        if (isIdentifier(node.key) && node.key.name === 'timelineReplace' && isArrayExpression(node.value)) {
          node.value.elements.forEach((element) => {
            if (!isObjectExpression(element)) {
              return
            }
            const timelineReplace: Required<TimelineReplacement> = {
              locale: 'en',
              missingTranslations: false,
              replaceSync: {},
              replaceText: {},
            }
            element.properties.forEach((locales) => {
              if (!isObjectProperty(locales)) {
                return
              }
              const name = isStringLiteral(locales.key)
                ? locales.key.value
                : isIdentifier(locales.key)
                ? locales.key.name
                : null
              if (name === 'locale' && isStringLiteral(locales.value)) {
                timelineReplace.locale = locales.value.value as keyof LocaleText
              }
              if (name === 'replaceSync' && isObjectExpression(locales.value)) {
                locales.value.properties.forEach((prop) => {
                  if (!isObjectProperty(prop)) {
                    return
                  }
                  const { key, value } = prop
                  if (!isStringLiteral(key) || !isStringLiteral(value)) {
                    return
                  }
                  timelineReplace.replaceSync[key.value] = value.value
                })
              }
              if (name === 'replaceText' && isObjectExpression(locales.value)) {
                locales.value.properties.forEach((prop) => {
                  if (!isObjectProperty(prop)) {
                    return
                  }
                  const { key, value } = prop
                  if (!isStringLiteral(key) || !isStringLiteral(value)) {
                    return
                  }
                  timelineReplace.replaceText[key.value] = value.value
                })
              }
            })
            ret.push(timelineReplace)
          })
        }
      },
    },
  }
}
