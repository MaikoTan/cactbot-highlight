# cactbot-highlight

A custom extension for developing [cactbot](https://github.com/quisquous/cactbot/) modules.

## Index

- [Features](#features)
- [Install](#install)
  - [Install from VSIX](#install-from-vsix)
  - [Install from source code](#install-from-source-code)
  - [Enable it in cactbot](#enable-it-in-cactbot)
  - [Available Settings](#available-settings)
- [Known Issues](#known-issues)
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

> snippets in trigger.js files

![snippets](images/snippets.gif)

## Install

### Install from VSIX

- Download the latest release `cactbot-highlight-x.x.x.vsix` from [Release](https://github.com/MaikoTan/cactbot-highlight/releases)

- Launch VSCode and switch to `Extensions` tab

- Click the `Views and More Actions...` (3-dots) button, select `Install from VSIX...`

- Enjoy ~

### Install from source code

- Install [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/)

- Download source code

- Run the commands below

```bash
yarn install
yarn run compile
```

- Copy the whole directory to your extensions root:

  - Linux / OS X: `~/.vscode/extensions/`
  - Windows: `C:\Users\your-name\.vscode\extensions\`

- Re-launch VSCode end enjoy ~

### Enable it in cactbot

Because cactbot timeline file is `*.txt`,
VSCode would recognize it as `Plain Text` before the extension enabled.

You should enable it manually for timeline file.

- For a single file

Click `Plain Text` button at right bottom,
select `cactbot-timeline` in the prompt window.

- For the whole repository

Create `.vscode/settings.json` if you have no this file.

Add this below to the file.

```json
{
    "files.associations": {
        "*.txt": "cactbot-timeline"
    }
}
```

### Available Settings

```json
// Set default locale for timelines. If this property is set, a prompt would not shown.
// value can be: [ "de","fr","ja","cn","ko" ]
"cactbot.timeline.defaultLocale": "ja",
```

## Known Issues

Timeline highlighting is incomplete.

Need more snippets in other files.

## Contributing

See: [CONTRIBUTING.md](CONTRIBUTING.md)