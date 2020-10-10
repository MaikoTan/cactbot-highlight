# Contribute to cactbot-highlight

Before contributing to this project, you might need to learn glossary from [cactbot](https://github.com/quisquous/cactbot/).

## Developing

### Requirements

- [VSCode](https://code.visualstudio.com/)
- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)

### Install dependencies

Run `yarn install` to install all the dependencies.

If you want to package the extension to `VSIX`,
it is recommanded to install `vsce` globally by `yarn global add vsce`.

### Build and Debug

Press <kbd>F5</kbd> to Debug.

Press <kbd>Ctrl</kbd> + <kbd>F5</kbd> to Run.

### Package

Run `vsce package`.

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
