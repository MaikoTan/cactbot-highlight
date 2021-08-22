/* eslint-disable @typescript-eslint/no-var-requires */
const { doesNotMatch } = require("assert");
const del = require("del");
const es = require("event-stream");
const gulp = require("gulp");
const filter = require("gulp-filter");
const ts = require("gulp-typescript");
const jsYaml = require("js-yaml");
const path = require("path");
const typescript = require("typescript");
const vsce = require("vsce");
const nls = require("vscode-nls-dev");

const tsProject = ts.createProject("./tsconfig.json", { typescript });

const languages = [
  { folderName: "ja", id: "ja" },
  { folderName: "zh-CN", id: "zh-cn" },
  { folderName: "zh-TW", id: "zh-tw" },
];

const cleanTask = function() {
	return del(["dist/**", "package.nls.*.json", "cactbot-highlight*.vsix"]);
};

const convertYaml = function() {
  return gulp.src(["syntaxes/timeline.tmLanguage.yaml"])
    .pipe(es.map(function(file, cb) {
      if (file.isNull()) {
        // pass along
        return cb(null, file);
      }
      if (file.isStream()) {
        return cb(new Error("Streaming not supported"));
      }

      const content = file.contents.toString("utf8");
      try {
        const json = jsYaml.load(content);
        const result = JSON.stringify(json, null, 2);
        file.contents = Buffer.from(result);
        file.path = file.path.replace(/\.yaml$/, ".json");
        cb(null, file);
      } catch (e) {
        console.log(e);
        return cb(null, file);
      }
    }))
    .pipe(gulp.dest("syntaxes/"));
};

gulp.task("port-i18n", function() {
  return tsProject.src()
  .pipe(tsProject()).js
  .pipe(nls.createMetaDataFiles())
  // Filter down to only the files we need
  .pipe(filter(["**/*.nls.json", "**/*.nls.metadata.json"]))

  // Consoldate them into nls.metadata.json, which the xlf is built from.
  .pipe(nls.bundleMetaDataFiles("maikotan.cactbot-highlight", "."))

  // filter down to just the resulting metadata files
  .pipe(filter(["**/nls.metadata.header.json", "**/nls.metadata.json"]))

  // Add package.nls.json, used to localized package.json
  .pipe(gulp.src(["package.nls.json"]))
  .pipe(nls.createXlfFiles("cactbot-highlight", "cactbot-highlight"))
  .pipe(gulp.dest("../crowdin-i18n"));
});

gulp.task("import-translations", function(done) {
  return es.merge(languages.map((language) => {
    return gulp.src([`../crowdin-i18n/cactbot-highlight (translations)/${language.folderName}/*.xlf`])
      .pipe(nls.prepareJsonFiles())
      .pipe(gulp.dest(path.join("./i18n", language.folderName)));
  }))
  .pipe(es.wait(() => done()));
});

const addI18nTask = function() {
	return gulp.src(["package.nls.json"])
		.pipe(nls.createAdditionalLanguageFiles(languages, "i18n"))
		.pipe(gulp.dest("."));
};

const compile = () => {
  return tsProject.src()
    .pipe(tsProject()).js
    .pipe(nls.rewriteLocalizeCalls())
    .pipe(nls.createAdditionalLanguageFiles(languages, "i18n", "dist"))
    .pipe(gulp.dest("./dist"));
};

const vscePackageTask = () => {
	return vsce.createVSIX();
};

gulp.task("clean", cleanTask);

gulp.task("build", gulp.series(convertYaml, compile, addI18nTask));

gulp.task("package", gulp.series(convertYaml, compile, addI18nTask, vscePackageTask));
