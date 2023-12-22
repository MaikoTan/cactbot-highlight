# Contribute to cactbot-highlight

Before contributing to this project, you might need to learn glossary from [cactbot](https://github.com/OverlayPlugin/cactbot/).

## Developing

### Requirements

- [VSCode Insider](https://code.visualstudio.com/), note ONLY insider version can be used to develop VSCode extensions.
- [Node.js](https://nodejs.org/), Node.js version >= 14.x is required.
- [Yarn](https://yarnpkg.com/)

### Install dependencies

Run `yarn install` to install all the dependencies.

### Build and Debug

Run `yarn build` to build the project.

After building, you can press <kbd>F5</kbd> to debug, or
press <kbd>Ctrl</kbd> + <kbd>F5</kbd> to run without debugging.

### Package

You can run `yarn package` to build and package code to a VSIX package,
which can be installed manually in VSCode.

### Internationalization

i18n files is not upload to GitHub.
The GitHub Action workflow would export and download i18n files
from crowdin, which is the site that we are using for localization.

You can run `yarn port-i18n` to export i18n json files from source code.

If you want to contribute translations, please access [crowdin](https://crowdin.com/project/cactbot-highlight).

## File Structures

### Timeline Syntaxes / Highlighting

Here is a [Syntax Highlight Guide](https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide) from VSCode.

`cactbot-highlight` uses `YAML` to describe syntax instead of `JSON`,
but VSCode only recognize `JSON`, building script would automatically invoke the conversion,
or you can run `yarn run convert` to do this.

Check `YAML` files under `syntaxes/`.

### Snippets

Here is a [Snippets Guide](https://code.visualstudio.com/api/language-extensions/snippet-guide) from VSCode.

Check `JSON` files under `snippets/`.

### Programmatic Feature (timeline adjustment / translations, etc)

`cactbot-highlight` now relies on `cactbot`'s structure of files and directories deeply.

Check files under `src/`.
