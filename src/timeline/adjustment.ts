import { Range, Selection, TextEditor, window } from 'vscode'
import * as nls from 'vscode-nls'

import { adjustTime } from '../utils'

const localize = nls.loadMessageBundle()

/** indicate the whole lines is selected */
const selectWholeLines = (selection: Selection, editor: TextEditor): Range => {
  const start = selection.start
  const end = selection.end
  return new Range(editor.document.lineAt(start).range.start, editor.document.lineAt(end).range.end)
}

export const incDecTime = async (): Promise<void> => {
  const editor = window.activeTextEditor
  if (!editor) {
    return
  }

  const range = selectWholeLines(editor.selection, editor)

  // show an input box
  const inputValue = await window.showInputBox({
    prompt: localize('incDecTime.prompt', 'Input a number (can be negative)'),
    validateInput: (value) => {
      if (/(-)?\d+(\.\d)?/.test(value)) {
        return null
      }
      return localize(
        'incDecTime.inputValidNumber1DigitOnly',
        'Please input valid number (only 1 decimal place is allowed)',
      )
    },
  })

  // if input is canceled, do nothing
  if (!inputValue) {
    return
  }
  const adjustNumber = Number(inputValue)

  const originalText = editor.document.getText(range)
  // text might contain \r\n or \n as new line
  const adjustedText = adjustTime(originalText.split(/\r?\n/), adjustNumber)
  await editor.edit((editBuilder) => {
    // in here \n would be automatically replaced by \r\n when document is CRLF
    editBuilder.replace(range, adjustedText.join('\n'))
  })
}

export const setTime = async (): Promise<void> => {
  const editor = window.activeTextEditor
  if (!editor) {
    return
  }

  const range = selectWholeLines(editor.selection, editor)

  // show an input box
  const inputValue = await window.showInputBox({
    prompt: localize('setTime.prompt', 'Input a number (can be negative)'),
    validateInput: (value) => {
      if (/\d+(\.\d)?/.test(value)) {
        return null
      }
      return localize('setTime.inputValidNumber', 'Please input valid number')
    },
  })

  // if input is canceled, do nothing
  if (!inputValue) {
    return
  }
  const destinationTime = Number(inputValue)

  const originalText = editor.document.getText(range)
  const originalTime = Number(originalText.split(/\r?\n/)[0].match(/^\s*(?<time>\d+(\.\d)?)\s.*$/)?.groups?.time)

  let adjust = 0
  if (originalTime) {
    adjust = destinationTime - originalTime
  }
  // text might contain \r\n or \n as new line
  const adjustedText = adjustTime(originalText.split(/\r?\n/), adjust)
  await editor.edit((editBuilder) => {
    // in here \n would be automatically replaced by \r\n when document is CRLF
    editBuilder.replace(range, adjustedText.join('\n'))
  })
}
