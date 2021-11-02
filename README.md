# cactbot-highlight

<a href="https://marketplace.visualstudio.com/items?itemName=MaikoTan.cactbot-highlight" target="_blank"><img align="right" src="./images/cactbot-logo-320x320.png"></img></a>

[![Visual Studio Market](https://img.shields.io/visual-studio-marketplace/v/MaikoTan.cactbot-highlight?color=green&label=Visual%20Studio%20Market)](https://marketplace.visualstudio.com/items?itemName=MaikoTan.cactbot-highlight)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/MaikoTan.cactbot-highlight?color=green)](https://marketplace.visualstudio.com/items?itemName=MaikoTan.cactbot-highlight)

A custom extension for developing [cactbot](https://github.com/quisquous/cactbot/) modules.

## Index

- [Features](#features)
- [Install](#install)
  - [Install from VSIX](#install-from-vsix)
  - [Enable it in cactbot](#enable-it-in-cactbot)
  - [Available Settings](#available-settings)
  - [How to build your own](#how-to-build-your-own)
- [Localisation](#localisation)
- [Contributing](#contributing)

## Features

### timeline highlight

![timeline-highlight](images/timeline-highlight.png)

> uwu timeline with Monakai color theme

### adjust time

![adjust-time](images/adjust-time.gif)

### translate timeline

![translate-timeline.gif](images/translate-timeline.gif)

### useful snippets

## Install

If you got troubles when install from Visual Studio Market,
you can install `cactbot-highlight` manually:

### Install from VSIX

1. Download the latest release `cactbot-highlight-x.x.x.vsix` from [Release](https://github.com/MaikoTan/cactbot-highlight/releases)

1. Launch VSCode and switch to `Extensions` tab

1. Click the `Views and More Actions...` (3-dots) button, select `Install from VSIX...`

1. select the file you downloaded and click `OK`

1. Enjoy ~

### Enable timeline highlighting in cactbot repo

If you're using this extension in the cactbot repo that you clone from [quisquous' branch](https://github.com/quisquous/cactbot),
this feature is already **enabled by default**, because there is already a default settings in `.vscode` directory.

But if you're using this extension out of a repo, you *might* need to enable it manually.

> Because cactbot timeline file is a `*.txt` file,
> VSCode would recognize it as `Plain Text` before the extension enabled.

#### Enable it for your activated timeline document

Click `Plain Text` button at right bottom,
select `cactbot-timeline` in the prompt window.

#### Enable it for the whole workspace (aka, the `cactbot` repo)

Create `.vscode/settings.json` if you have no this file.

Add/modify this below to the file.

```json
{
    "files.associations": {
        "**/data/**/*.txt": "cactbot-timeline"
    }
}
```

### Available Settings

#### GUI

Under `Settings -> Extensions -> Cactbot Highlight`,
you can configure this extension by GUI.

#### `settings.json` file

```jsonc
// Set a default language for timelines translating.
// If you don't want to be asked which language do you want to translate to
// every time, you can set this property to your prefer language.
// value can be one of: [ "de", "fr", "ja", "cn", "ko" ]
"cactbot.timeline.defaultLocale": "ja",
```

### How to build your own

- Install [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/)

- Download source code

- Run the commands below

```bash
yarn install
yarn run build
```

- Press <kbd>F5</kbd> for executing in development mode.

- If you want to package a VSIX file, run the commands below:

```bash
yarn run build
yarn run package
```

## Localisation

This extension supports multi-language.

Current localisation process: [![Crowdin](https://badges.crowdin.net/cactbot-highlight/localized.svg)](https://crowdin.com/project/cactbot-highlight)

Translators are listed below. Thanks for your contribution!

- Simplified Chinese - [@ShadyWhite](https://github.com/ShadyWhite)
- Traditional Chinese - [@MaikoTan](https://github.com/MaikoTan)
- Japanese - [@MaikoTan](https://github.com/MaikoTan)
- French - [@MaikoTan](https://github.com/MaikoTan)

If you want to add a new language, or contribute to the existing ones,
please visit [our project on Crowdin](https://crowdin.com/project/cactbot-highlight).

If you want to add a new language, you should make sure that the language is supported by VSCode officially.
You can search for the language name in the Extensions Marketplace,
or access [microsoft/vscode-loc](https://github.com/microsoft/vscode-loc) to see if your language is supported or not.

## Contributing

See: [CONTRIBUTING.md](CONTRIBUTING.md)

## License

This project is licensed under the MIT license,
see [LICENSE](LICENSE.md) for more detail.
