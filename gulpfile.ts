/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path'

import * as es from 'event-stream'
import gulp from 'gulp'
import babel from 'gulp-babel'
import esbuild from 'gulp-esbuild'
import filter from 'gulp-filter'
import jsYaml from 'js-yaml'
import { dynamicImport } from 'tsimportlib'
import File from 'vinyl'
import { createVSIX } from 'vsce'
import * as nls from 'vscode-nls-dev'

const languages = [
  { folderName: 'ja', id: 'ja' },
  { folderName: 'zh-CN', id: 'zh-cn' },
  { folderName: 'zh-TW', id: 'zh-tw' },
  { folderName: 'fr', id: 'fr' },
]

const cleanTask = async function () {
  return (await dynamicImport('del', module)).deleteAsync([
    'dist/**',
    'package.nls.*.json',
    'cactbot-highlight*.vsix',
    'crowdin-i18n/**',
  ])
}

const convertYaml = function () {
  return gulp
    .src(['syntaxes/timeline.tmLanguage.yaml'])
    .pipe(
      es.map(function (file: File, cb: (err: Error | null, data?: File) => void) {
        if (file.isNull()) {
          // pass along
          return cb(null, file)
        }
        if (file.isStream()) {
          return cb(new Error('Streaming not supported'))
        }

        const content = file.contents?.toString('utf8')
        try {
          const json = jsYaml.load(content ?? '')
          const result = JSON.stringify(json, null, 2)
          file.contents = Buffer.from(result)
          file.path = file.path.replace(/\.yaml$/, '.json')
          cb(null, file)
        } catch (e) {
          console.log(e)
          return cb(null, file)
        }
      }),
    )
    .pipe(gulp.dest('syntaxes/'))
}

gulp.task('port-i18n', function () {
  // In order to include localisable text of localisation function calls
  // provided by `vscode-nls`, we need to transpile typescript to javascript
  // so that `vscode-nls-dev` would recognize those calls.

  // But importing cactbot directly cause errors that are not easily to fix.
  // So we use babel (and its typescript preset) to transpile, as babel would
  // only translate typescript to javascript, and not do the type checking.
  // Also, here we should exclude test files as they has no localisation.
  return (
    gulp
      .src(['./src/**/*.ts', '!./src/test/**/*'])
      .pipe(
        babel({
          presets: ['@babel/preset-typescript'],
        }),
      )
      .pipe(nls.createMetaDataFiles())
      // Filter down to only the files we need
      .pipe(filter(['**/*.nls.json', '**/*.nls.metadata.json']))

      // Consoldate them into nls.metadata.json, which the xlf is built from.
      .pipe(nls.bundleMetaDataFiles('maikotan.cactbot-highlight', '.'))

      // filter down to just the resulting metadata files
      .pipe(filter(['**/nls.metadata.header.json', '**/nls.metadata.json']))

      // Add package.nls.json, used to localized package.json
      .pipe(gulp.src(['package.nls.json']))
      .pipe(nls.createXlfFiles('en', 'cactbot-highlight'))
      .pipe(gulp.dest('./crowdin-i18n/cactbot-highlight'))
  )
})

gulp.task('import-i18n', function (done) {
  return es
    .merge(
      languages.map((language) => {
        return gulp
          .src([`./crowdin-i18n/cactbot-highlight/${language.folderName}/*.xlf`])
          .pipe(nls.prepareJsonFiles())
          .pipe(gulp.dest(path.join('./i18n', language.folderName, 'dist')))
      }),
    )
    .pipe(es.wait(() => done()))
})

const addI18nTask = function () {
  return gulp
    .src(['package.nls.json'])
    .pipe(nls.createAdditionalLanguageFiles(languages, 'i18n', 'dist'))
    .pipe(gulp.dest('.'))
}

const compileWrapper = (minify: boolean) =>
  function compile() {
    return gulp
      .src('./src/extension.ts')
      .pipe(
        esbuild({
          sourcemap: true,
          minify,
          external: ['vscode'],
          bundle: true,
          platform: 'node',
          outfile: 'extension.js',
          tsconfig: 'tsconfig.json',
        }),
      )
      .pipe(nls.rewriteLocalizeCalls())
      .pipe(nls.createAdditionalLanguageFiles(languages, 'i18n', 'dist'))
      .pipe(gulp.dest('./dist'))
  }

const vscePackageTask = () => {
  return createVSIX({
    useYarn: true,
  })
}

gulp.task('clean', cleanTask)

gulp.task('build', gulp.series(convertYaml, compileWrapper(false), addI18nTask))

gulp.task('package', gulp.series(cleanTask, convertYaml, compileWrapper(true), addI18nTask, vscePackageTask))
