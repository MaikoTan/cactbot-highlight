# Change Log

All notable changes to the "cactbot-highlight" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.6.3] - 2024-12-11

## Fixed

* fix: timeline translate feature broken in some timeline by @MaikoTan in https://github.com/MaikoTan/cactbot-highlight/pull/493

## Changed

* refactor: move localize call outside by @MaikoTan in https://github.com/MaikoTan/cactbot-highlight/pull/444
* refactor: make more strings localisable by @MaikoTan in https://github.com/MaikoTan/cactbot-highlight/pull/446
* refactor: replace old vscode-nls to new l10n api by @MaikoTan in https://github.com/MaikoTan/cactbot-highlight/pull/448

## Others

* chore: update and clean dependencies by @MaikoTan in https://github.com/MaikoTan/cactbot-highlight/pull/443
* chore: fix watch command with gulp by @MaikoTan in https://github.com/MaikoTan/cactbot-highlight/pull/445
* chore: enable shallow checkout for cactbot by @MaikoTan in https://github.com/MaikoTan/cactbot-highlight/pull/449
* chore: migrate submodule cactbot to download from npm by @MaikoTan in https://github.com/MaikoTan/cactbot-highlight/pull/455
* ci: publish i18n content in a separate job by @MaikoTan in https://github.com/MaikoTan/cactbot-highlight/pull/457
* lint: format files with prettier by @MaikoTan in https://github.com/MaikoTan/cactbot-highlight/pull/456
* ci: disable fail-fast for matrix by @MaikoTan in https://github.com/MaikoTan/cactbot-highlight/pull/459
* build: migrate gulp + esbuild to rollup by @MaikoTan in https://github.com/MaikoTan/cactbot-highlight/pull/458
* ci: fix i18n push workflow condition by @MaikoTan in https://github.com/MaikoTan/cactbot-highlight/pull/460
* chore: switch glob to fast-glob by @MaikoTan in https://github.com/MaikoTan/cactbot-highlight/pull/461
* ci: fix i18n push workflow by @MaikoTan in https://github.com/MaikoTan/cactbot-highlight/pull/462
* ci: add crowdin api token environment variables by @MaikoTan in https://github.com/MaikoTan/cactbot-highlight/pull/463
* build(deps-dev): bump @crowdin/cli from 3.19.4 to 4.0.0 by @dependabot in https://github.com/MaikoTan/cactbot-highlight/pull/454
* build(deps-dev): bump @vscode/test-electron from 2.3.10 to 2.4.0 by @dependabot in https://github.com/MaikoTan/cactbot-highlight/pull/451
* chore: fix base path in crowdin configuration by @MaikoTan in https://github.com/MaikoTan/cactbot-highlight/pull/464
* build(deps-dev): bump markdown-magic from 2.6.1 to 3.0.10 by @dependabot in https://github.com/MaikoTan/cactbot-highlight/pull/452
* build(deps): bump cactbot from 0.31.5 to 0.32.5 by @dependabot in https://github.com/MaikoTan/cactbot-highlight/pull/472
* build(deps-dev): bump @rollup/plugin-commonjs from 25.0.8 to 26.0.1 by @dependabot in https://github.com/MaikoTan/cactbot-highlight/pull/468
* build(deps-dev): bump @typescript-eslint/parser from 7.11.0 to 7.18.0 by @dependabot in https://github.com/MaikoTan/cactbot-highlight/pull/470
* build(deps-dev): bump prettier from 3.2.5 to 3.3.3 by @dependabot in https://github.com/MaikoTan/cactbot-highlight/pull/471
* build(deps): bump braces from 3.0.2 to 3.0.3 by @dependabot in https://github.com/MaikoTan/cactbot-highlight/pull/465
* style: fix markdown lint errors by @MaikoTan in https://github.com/MaikoTan/cactbot-highlight/pull/473
* build(deps-dev): bump @vscode/test-electron from 2.4.0 to 2.4.1 by @dependabot in https://github.com/MaikoTan/cactbot-highlight/pull/475
* build(deps-dev): bump markdown-magic from 3.0.10 to 3.3.0 by @dependabot in https://github.com/MaikoTan/cactbot-highlight/pull/476
* build(deps-dev): bump rollup from 4.18.0 to 4.24.3 by @dependabot in https://github.com/MaikoTan/cactbot-highlight/pull/485
* build(deps-dev): bump eslint-import-resolver-typescript from 3.6.1 to 3.6.3 by @dependabot in https://github.com/MaikoTan/cactbot-highlight/pull/477
* build(deps-dev): bump eslint-plugin-prettier from 5.1.3 to 5.2.1 by @dependabot in https://github.com/MaikoTan/cactbot-highlight/pull/478
* build(deps): bump micromatch from 4.0.5 to 4.0.8 by @dependabot in https://github.com/MaikoTan/cactbot-highlight/pull/479
* ci: fix wrong condition of fail fast introduced in #459 by @MaikoTan in https://github.com/MaikoTan/cactbot-highlight/pull/486

## [0.6.2] - 2024-05-24

> [!NOTE]
> This release can be only installed on Visual Studio Code 1.82.0 or higher.

### Added

- i18n: add korean translations by @MaikoTan in [#442](https://github.com/MaikoTan/cactbot-highlight/pull/442) (Thanks @Bing-su)

## Others

- chore: add open-vsx link and download in readme by @MaikoTan in [#418](https://github.com/MaikoTan/cactbot-highlight/pull/418)
- build(deps): bump es5-ext from 0.10.53 to 0.10.64 by @dependabot in [#419](https://github.com/MaikoTan/cactbot-highlight/pull/419)
- build(deps-dev): bump @babel/preset-env from 7.23.9 to 7.24.0 by @dependabot in [#424](https://github.com/MaikoTan/cactbot-highlight/pull/424)
- build(deps): bump typescript from 4.9.5 to 5.4.2 by @dependabot in [#425](https://github.com/MaikoTan/cactbot-highlight/pull/425)
- build(deps-dev): bump @babel/core from 7.23.9 to 7.24.0 by @dependabot in [#420](https://github.com/MaikoTan/cactbot-highlight/pull/420)
- build(deps-dev): bump glob from 10.3.10 to 10.3.12 by @dependabot in [#429](https://github.com/MaikoTan/cactbot-highlight/pull/429)
- build(deps-dev): bump @babel/generator from 7.23.6 to 7.24.1 by @dependabot in [#428](https://github.com/MaikoTan/cactbot-highlight/pull/428)
- build(deps-dev): bump mocha from 10.3.0 to 10.4.0 by @dependabot in [#426](https://github.com/MaikoTan/cactbot-highlight/pull/426)
- build(deps-dev): bump @babel/core from 7.24.0 to 7.24.4 by @dependabot in [#430](https://github.com/MaikoTan/cactbot-highlight/pull/430)
- build(deps-dev): bump @babel/generator from 7.24.4 to 7.24.5 by @dependabot in [#431](https://github.com/MaikoTan/cactbot-highlight/pull/431)
- build(deps-dev): bump gulp-cli from 2.3.0 to 3.0.0 by @dependabot in [#433](https://github.com/MaikoTan/cactbot-highlight/pull/433)
- build(deps-dev): bump gulp from 4.0.2 to 5.0.0 by @dependabot in [#434](https://github.com/MaikoTan/cactbot-highlight/pull/434)
- chore: update vscode to 1.82 and node to 18 by @MaikoTan in [#435](https://github.com/MaikoTan/cactbot-highlight/pull/435)
- test: enable test suites by @MaikoTan in [#436](https://github.com/MaikoTan/cactbot-highlight/pull/436)
- chore: update cactbot to 6f13c527767f60c52623c29db355b87bb18f666e by @MaikoTan in [#437](https://github.com/MaikoTan/cactbot-highlight/pull/437)
- chore: move test files out of src folder by @MaikoTan in [#438](https://github.com/MaikoTan/cactbot-highlight/pull/438)
- ci: update actions versions by @MaikoTan in [#440](https://github.com/MaikoTan/cactbot-highlight/pull/440)
- ci: add test workflow in ci by @MaikoTan in [#439](https://github.com/MaikoTan/cactbot-highlight/pull/439)
- chore: add badges in readme by @MaikoTan in [#441](https://github.com/MaikoTan/cactbot-highlight/pull/441)

## [0.6.1] - 2024-02-27

### Added

- Support new cactbot timeline net sync syntax. ([#416]([#416](https://github.com/MaikoTan/cactbot-highlight/pull/416)))
- Update cactbot to commit [`6d127b8`](https://github.com/OverlayPlugin/cactbot/commit/6d127b8b976f9cffe360700f7fecf73f1418c984). ([`c34a3d2`](https://github.com/MaikoTan/cactbot-highlight/commit/c34a3d29dbb4cc9d9fed79578ddf5266f690cbfa))

### Fixed

- Unexpected escaped quotes. ([#408]([#408](https://github.com/MaikoTan/cactbot-highlight/pull/408)))

### Changed

- Migrate to TypeScript transformer for timeline translation from slow-y babel. ([#409]([#409](https://github.com/MaikoTan/cactbot-highlight/pull/409)))

## [0.6.0] - 2023-12-23

### Added

- New network log sync syntax highlight. ([#406]([#406](https://github.com/MaikoTan/cactbot-highlight/pull/406)))

## [0.5.2] - 2023-12-22

### Added

- Add new keyword `forcejump` and `label`. ([#400]([#400](https://github.com/MaikoTan/cactbot-highlight/pull/400)))

### Changed

- Migrate cactbot to use [`OverlayPlugin/cactbot`] repository. ([#402]([#402](https://github.com/MaikoTan/cactbot-highlight/pull/402)))

## [0.5.1] - 2023-11-29

### Other

- Update most documentations. ([`38705d3`](https://github.com/MaikoTan/cactbot-highlight/commit/38705d3658f8b981ac1d9bcbd5d6ef3e77b28762) [`02354c1`](https://github.com/MaikoTan/cactbot-highlight/commit/02354c1fdd8ae5570c039a16a02456e96e1ec0b5) [`41b19d0`](https://github.com/MaikoTan/cactbot-highlight/commit/41b19d088b5d6cda3b7e44dadf7ee2071fb30086) [`b3be2bd`](https://github.com/MaikoTan/cactbot-highlight/commit/b3be2bdb5976f2448a41d4f10d561fa7379eaaa3) [`59249e8`](https://github.com/MaikoTan/cactbot-highlight/commit/59249e8b9163877668a5ed101856245d820ad850) [`46c40d7`](https://github.com/MaikoTan/cactbot-highlight/commit/46c40d7aae20248f34f1b4d83608649dfe9a78e5))

## [0.5.0] - 2023-11-29

### Added

- Add `make_timeline` button in CodeLens for timeline files. ([`04dadc2`](https://github.com/MaikoTan/cactbot-highlight/commit/04dadc2fb9834db873e9efcb8ea175260b67404a))
- Add button for timeline translation on top right of editor. ([`5e1cf51`](https://github.com/MaikoTan/cactbot-highlight/commit/5e1cf512d0397e948b01dd45386ab41ad1ac9eea))
- Update code snippets ([#247]([#247](https://github.com/MaikoTan/cactbot-highlight/pull/247)))

### Fixed

- update cactbot to commit [`b4e5b8c`](https://github.com/quisquous/cactbot/compare/a441ac5355a7e02baa51ae6afa710784469f47c7...b4e5b8c10426ef6c9d55d5426ea6d26718270264).

## [0.4.12] - 2022-05-09

## Fixed

- Update cactbot to commit [`a441ac5`](https://github.com/quisquous/cactbot/commit/a441ac5355a7e02baa51ae6afa710784469f47c7)

## [0.4.11] - 2021-11-05

### Fixed

- Changed some text

### Changed

- Extension setting title change to "Cactbot Highlight"

### Security

- Bump `vsce` to 2.1.0

## [0.4.10] - 2021-11-04

### Security

- Bump `vsce` to 0.103.0

## [0.4.9] - 2021-11-03

### Changed

- Remove cactbot from the archive cause it is already bundled in `extension.js`

### Security

- Bump `@babel/generator` and `@babel/plugin-transform-typescript` to latest.

## [0.4.8] - 2021-11-02

### Fixed

- Most feature of the extension didn't work

## [0.4.7] - 2021-11-02

### Fixed

- change some message to ease of reading

### Changed

- import cactbot as a submodule, stop copying code from cactbot.
- automatically fetch translations from crowdin in every build.

## [0.4.6] - 2021-09-28

### Changed

- upgrade vscode to 1.60.0.
  - if your vscode is lower than this version, vscode would automatically install the older version.

## [0.4.5] - 2021-09-01

### Fixed

- Load translations error (message bundle not found)

## [0.4.4] - 2021-09-01

### Added

- Translations:
  - French (`fr`)

## [0.4.3] - 2021-08-22

### Added

- Translations:
  - Japanese (`ja`)
  - Simplified Chinese (`zh-CN`)
  - Traditional Chinese (`zh-TW`)

## [0.4.2] - 2021-08-22

### Fixed

- Fix message typos

## [0.4.1] - 2021-08-22

### Fixed

- Fix message typoes in the extension.

## [0.4.0] - 2021-08-22

### Added

- Multi-language support.

### Changed

- Timeline highlight method changed, should be more stable.
- The name of the extension changed to "Cactbot Highlight".
- Now using gulp to build the extension.

## [0.3.8] - 2021-07-18

### Fixed

- Syntax Error when parse trigger files

## [0.3.7] - 2021-07-18

### Fixed

- Translate feature support TypeScript trigger files

## [0.3.6] - 2021-05-11

### Added

- Enable extension when open up a timeline file

### Fixed

- Update `vsce` to 1.88.0 to avoid [CVE-2021-23358](https://github.com/advisories/GHSA-cf4h-3jhx-xvhq)

## [0.3.5] - 2021-04-15

### Changed

- Add "cactbot-highlight" prefix on every commands

## [0.3.4] - 2021-03-20

### Fixed

- Sync description
- 'Input' -> 'Select'

## [0.3.3] - 2021-03-19

### Added

- Add `knockback` german translation in common replacement

## [0.3.2] - 2021-02-27

### Added

- Translating timeline to English is supported now. (See also [#2402](https://github.com/quisquous/cactbot/pull/2402))

## [0.3.1] - 2021-02-08

### Fixed

- Get english text when specify default locale

## [0.3.0] - 2021-02-08

### Added

- Timeline translating feature implemented via pure `babel`

- `cactbot-highlight` now built via webpack, for performance.

## [0.2.2] - 2021-02-06

### Added

- Translating feature don't depends on cactbot's project structure now.

## [0.2.1] - 2021-01-22

### Added

- Pick locale in list instead of manually type when translating timeline

## [0.2.0] - 2021-01-03

### Added

- More snippets for cactbot raidboss module

## [0.1.5] - 2020-12-11

### Fixed

- Adjust time without 1 digit

## [0.1.4] - 2020-12-09

### Fixed

- Regex matching out of sync text

## [0.1.3] - 2020-12-08

### Fixed

- Translating feature broken since cactbot migrate to ES6 modules

## [0.1.2] - 2020-11-21

### Fixed

- Translating feature broken since cactbot migrated to webpack

## [0.1.1] - 2020-10-13

### Fixed

- Dependency 'vm2' not found

## [0.1.0] - 2020-10-10

### Added

- Rewrite translate module, don't need python anymore

Using vm2(https://github.com/patriksimek/vm2) for executing
cactbot javascript and take trigger file content out.

Define many types in cactbot for TypeScript,
maybe helpful when migrating cactbot to TypeScript.

- CommonReplacement support.

- Automatically refresh preview document when original file was changed.

## [0.0.5] - 2020-10-09

### Fixed

- Wrong encoding on Windows

## [0.0.4] - 2020-10-09

### Added

- Adjust time to number from context menu

- Translate timeline

## [0.0.3] - 2020-10-08

### Added

- Adjust time by number from context menu

## [0.0.2] - 2020-10-06

### Fixed

- Float number is not currectly matched

## [0.0.1] - 2020-10-06

### Added

- Basic highlighting for cactbot timeline files

- Some useful snippets

[0.0.1]: https://github.com/MaikoTan/cactbot-highlight/tree/0.0.1
[0.0.2]: https://github.com/MaikoTan/cactbot-highlight/compare/0.0.1...0.0.2
[0.0.3]: https://github.com/MaikoTan/cactbot-highlight/compare/0.0.2...0.0.3
[0.0.4]: https://github.com/MaikoTan/cactbot-highlight/compare/0.0.3...0.0.4
[0.0.5]: https://github.com/MaikoTan/cactbot-highlight/compare/0.0.4...0.0.5
[0.1.0]: https://github.com/MaikoTan/cactbot-highlight/compare/0.0.5...0.1.0
[0.1.1]: https://github.com/MaikoTan/cactbot-highlight/compare/0.1.0...0.1.1
[0.1.2]: https://github.com/MaikoTan/cactbot-highlight/compare/0.1.1...0.1.2
[0.1.3]: https://github.com/MaikoTan/cactbot-highlight/compare/0.1.2...0.1.3
[0.1.4]: https://github.com/MaikoTan/cactbot-highlight/compare/0.1.3...0.1.4
[0.1.5]: https://github.com/MaikoTan/cactbot-highlight/compare/0.1.4...0.1.5
[0.2.0]: https://github.com/MaikoTan/cactbot-highlight/compare/0.1.5...0.2.0
[0.2.1]: https://github.com/MaikoTan/cactbot-highlight/compare/0.2.0...0.2.1
[0.2.2]: https://github.com/MaikoTan/cactbot-highlight/compare/0.2.1...0.2.2
[0.3.0]: https://github.com/MaikoTan/cactbot-highlight/compare/0.2.2...0.3.0
[0.3.1]: https://github.com/MaikoTan/cactbot-highlight/compare/0.3.0...0.3.1
[0.3.2]: https://github.com/MaikoTan/cactbot-highlight/compare/0.3.1...0.3.2
[0.3.3]: https://github.com/MaikoTan/cactbot-highlight/compare/0.3.2...0.3.3
[0.3.4]: https://github.com/MaikoTan/cactbot-highlight/compare/0.3.3...0.3.4
[0.3.5]: https://github.com/MaikoTan/cactbot-highlight/compare/0.3.4...0.3.5
[0.3.6]: https://github.com/MaikoTan/cactbot-highlight/compare/0.3.5...0.3.6
[0.3.7]: https://github.com/MaikoTan/cactbot-highlight/compare/0.3.6...0.3.7
[0.3.8]: https://github.com/MaikoTan/cactbot-highlight/compare/0.3.7...0.3.8
[0.4.0]: https://github.com/MaikoTan/cactbot-highlight/compare/0.3.8...0.4.0
[0.4.1]: https://github.com/MaikoTan/cactbot-highlight/compare/0.4.0...0.4.1
[0.4.2]: https://github.com/MaikoTan/cactbot-highlight/compare/0.4.1...0.4.2
[0.4.3]: https://github.com/MaikoTan/cactbot-highlight/compare/0.4.2...0.4.3
[0.4.4]: https://github.com/MaikoTan/cactbot-highlight/compare/0.4.3...0.4.4
[0.4.5]: https://github.com/MaikoTan/cactbot-highlight/compare/0.4.4...0.4.5
[0.4.6]: https://github.com/MaikoTan/cactbot-highlight/compare/0.4.5...0.4.6
[0.4.7]: https://github.com/MaikoTan/cactbot-highlight/compare/0.4.6...0.4.7
[0.4.8]: https://github.com/MaikoTan/cactbot-highlight/compare/0.4.7...0.4.8
[0.4.9]: https://github.com/MaikoTan/cactbot-highlight/compare/0.4.8...v0.4.9
[0.4.10]: https://github.com/MaikoTan/cactbot-highlight/compare/v0.4.9...v0.4.10
[0.4.11]: https://github.com/MaikoTan/cactbot-highlight/compare/v0.4.10...v0.4.11
[0.4.12]: https://github.com/MaikoTan/cactbot-highlight/compare/v0.4.11...v0.4.12
[0.5.0]: https://github.com/MaikoTan/cactbot-highlight/compare/v0.4.12...v0.5.0
[0.5.1]: https://github.com/MaikoTan/cactbot-highlight/compare/v0.5.0...v0.5.1
[0.5.2]: https://github.com/MaikoTan/cactbot-highlight/compare/v0.5.1...v0.5.2
[0.6.0]: https://github.com/MaikoTan/cactbot-highlight/compare/v0.5.2...v0.6.0
[0.6.1]: https://github.com/MaikoTan/cactbot-highlight/compare/v0.6.0...v0.6.1
[0.6.2]: https://github.com/MaikoTan/cactbot-highlight/compare/v0.6.1...v0.6.2
[0.6.3]: https://github.com/MaikoTan/cactbot-highlight/compare/v0.6.2...v0.6.3
[Unreleased]: https://github.com/MaikoTan/cactbot-highlight/compare/v0.6.3...master
