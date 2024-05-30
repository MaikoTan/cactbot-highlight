/* eslint-disable @typescript-eslint/no-var-requires */
import * as es from 'event-stream'
import gulp from 'gulp'
import esbuild from 'gulp-esbuild'
import jsYaml from 'js-yaml'
import { dynamicImport } from 'tsimportlib'
import File from 'vinyl'
import { createVSIX } from 'vsce'

const cleanTask = async function () {
  return (await dynamicImport('del', module)).deleteAsync([
    'dist/**',
    'package.nls.*.json',
    'l10n/*.json',
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
      .pipe(gulp.dest('./dist'))
  }

const vscePackageTask = () => {
  return createVSIX({
    useYarn: true,
  })
}

gulp.task('clean', cleanTask)

gulp.task('build', gulp.series(convertYaml, compileWrapper(false)))

gulp.task(
  'watch',
  gulp.series(
    // build all files first
    convertYaml,
    compileWrapper(false),
    // then watch for file changes
    function watch() {
      gulp.watch('src/**/*.ts', compileWrapper(false))
      gulp.watch('syntaxes/timeline.tmLanguage.yaml', convertYaml)
    },
  ),
)

gulp.task('package', gulp.series(cleanTask, convertYaml, compileWrapper(true), vscePackageTask))
