# cactbot-highlight

<a href="https://marketplace.visualstudio.com/items?itemName=MaikoTan.cactbot-highlight" target="_blank"><img align="right" src="./images/cactbot-logo-320x320.png"></img></a>

[![Visual Studio Market](https://img.shields.io/visual-studio-marketplace/v/MaikoTan.cactbot-highlight?color=green&label=Visual%20Studio%20Market)](https://marketplace.visualstudio.com/items?itemName=MaikoTan.cactbot-highlight)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/MaikoTan.cactbot-highlight?color=green)](https://marketplace.visualstudio.com/items?itemName=MaikoTan.cactbot-highlight)

A VSCode extension for developing [cactbot](https://github.com/quisquous/cactbot/) modules.

## Index

<!-- AUTO-GENERATED-CONTENT:START (TOC:maxDepth=3) -->

- [Index](#index)
- [Features](#features)
  - [Timeline Highlight](#timeline-highlight)
  - [Time Adjustment](#time-adjustment)
  - [Timeline Translating](#timeline-translating)
- [Install](#install)
  - [Enable Highlighting Feature Manually](#enable-highlighting-feature-manually)
  - [Available Settings](#available-settings)
- [Localisation](#localisation)
- [Contributing](#contributing)
- [License](#license)
<!-- AUTO-GENERATED-CONTENT:END -->

## Features

### [Raidboss](https://github.com/quisquous/cactbot/#raidboss-module) Timeline

#### Syntax Highlight

![timeline-highlight](images/timeline-highlight.png)

> Ultima Weapon Ultimate timeline with Monakai color theme

#### Time Adjustment

![adjust-time](images/adjust-time.gif)

#### Translation Validation

![translate-timeline.gif](images/translate-timeline.gif)

To use this feature, you should make sure your file actived
is a valid timeline file or trigger file that there are a valid
timeline file which has the same name in the same directory,
also make sure you are in the cactbot repository.

Press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> (Mac: <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>) to open the Command Palette,
then type and select `Translate Current Timeline` to translate the active file.

### [Raidboss](https://github.com/quisquous/cactbot/#raidboss-module) Triggers

#### Code Snippets

<table>
<thead>
<tr>
<th>Snippet</th>
<th>Description</th>
<th>Example</th>
</thead>
<tbody>
<tr>
<td>
<code>ca-init</code>
</td>
<td>initiate a complete trigger set</td>
<td>

```ts
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Params> = {
  zoneId: ZoneId.TheBindingCoilOfBahamutTurn4,
  timelineFile: 't13.txt',
  timelineTriggers: [],
  triggers: [],
  timelineReplace: [],
};

export default triggerSet;
```
</td>
</tr>
</tbody>
</table>

## Install

If you got troubles when install from Visual Studio Market,
you can download the VSIX file of `Cactbot Highlight` from [VSCode Extension Market](https://marketplace.visualstudio.com/items?itemName=MaikoTan.cactbot-highlight)
and [install it manually](https://code.visualstudio.com/docs/editor/extension-marketplace#_install-from-a-vsix).

### Enable Highlighting Feature Manually

If you're using this extension in the cactbot repo that you clone from [quisquous' branch](https://github.com/quisquous/cactbot),
this feature is already **enabled by default**, because there is already a default settings in `.vscode` directory.

But if you're using this extension out of a repo, you _might_ need to enable it manually.

> The extension name of Cactbot's timeline file is a `txt` file,
> which is recognized as "Plain Text" defaultly in VSCode,
> thus we should add an extra setting to enable the highlighting.

#### For a Single File

Click `Plain Text` button at right bottom,
select `cactbot-timeline` in the prompt window.

#### For the Whole Workspace

Create or edit `.vscode/settings.json`.

Add or modify this below to the file.

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

#### `settings.json` File

```jsonc
// Set a default language for timelines translating.
// If you don't want to be asked which language do you want to translate to
// every time, you can set this property to your prefer language.
// value can be one of: [ "de", "fr", "ja", "cn", "ko" ]
"cactbot.timeline.defaultLocale": "ja",
```

## Localisation

This extension supports multi-language.

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

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

This project is licensed under the MIT license,
see [LICENSE](LICENSE.md) for more detail.
