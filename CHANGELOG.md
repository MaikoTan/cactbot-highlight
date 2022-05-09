# Change Log

All notable changes to the "cactbot-highlight" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.12] - 2022-05-09

## Fixed

- Update cactbot to commit [a441ac5](https://github.com/quisquous/cactbot/commit/a441ac5355a7e02baa51ae6afa710784469f47c7)

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
