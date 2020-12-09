# Change Log

All notable changes to the "cactbot-highlight" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
