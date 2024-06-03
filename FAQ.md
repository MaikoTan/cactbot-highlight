# Frequently Asked Questions

<!-- AUTO-GENERATED-CONTENT:START (TOC:maxDepth=2) -->

- [I cannot install this extension from VSCode Marketplace. / I am not the fan of Microsoft.](#i-cannot-install-this-extension-from-vscode-marketplace--i-am-not-the-fan-of-microsoft)
- [Why isn't my timeline files not highlighted?](#why-isnt-my-timeline-files-not-highlighted)
<!-- AUTO-GENERATED-CONTENT:END -->

## I cannot install this extension from VSCode Marketplace. / I am not the fan of Microsoft.

If you got troubles when install from Visual Studio Market,
you can download the VSIX file of `Cactbot Highlight` from [VSCode Extension Market](https://marketplace.visualstudio.com/items?itemName=MaikoTan.cactbot-highlight)
and [install it manually](https://code.visualstudio.com/docs/editor/extension-marketplace#_install-from-a-vsix).

If you are using an OSS version of VSCode, you can also install it from [Open VSX Registry](https://open-vsx.org/extension/MaikoTan/cactbot-highlight).

## Why isn't my timeline files not highlighted?

If you're using this extension in the cactbot repo that you clone from
[OverlayPlugin's branch](https://github.com/OverlayPlugin/cactbot),
this feature is already **enabled by default**, because there is already
a default settings in `.vscode` directory.

But if you're using this extension out of a repo, you _might_ need to enable it manually.

> The timeline files in Cactbot are `*.txt` files,
> which is recognized as "Plain Text" by default in VSCode,
> thus we should add an extra setting to enable the highlighting.

### For a Single File

Click `Plain Text` button at right bottom,
select `cactbot-timeline` in the prompt window.

### For the Whole Workspace

Create or edit the `.vscode/settings.json` file in your workspace,
add or modify the `files.associations` option like the following example.

```json
{
  "files.associations": {
    "**/data/**/*.txt": "cactbot-timeline"
  }
}
```
