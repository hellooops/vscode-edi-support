<div align="center">
  <img src="./docs/images/icon-600x600.png" alt="EDI Support logo" width="128" height="128" />

  <h1>EDI Support for VS Code</h1>

  <p>
    <strong>Read, format, inspect, and troubleshoot EDI documents directly in VS Code.</strong><br />
    Built for X12, HIPAA, EDIFACT, and VDA workflows that need structure, clarity, and fast feedback.
  </p>

  <p>
    <a href="https://marketplace.visualstudio.com/items?itemName=DericLee.edi-edifact-support">
      <img src="https://img.shields.io/visual-studio-marketplace/v/DericLee.edi-edifact-support?color=007acc&style=for-the-badge" alt="VS Marketplace Version" />
    </a>
    <a href="https://marketplace.visualstudio.com/items?itemName=DericLee.edi-edifact-support">
      <img src="https://img.shields.io/visual-studio-marketplace/i/DericLee.edi-edifact-support?color=007acc&style=for-the-badge" alt="VS Marketplace Installs" />
    </a>
    <a href="./LICENSE">
      <img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="MIT License" />
    </a>
    <a href="https://github.com/hellooops/vscode-edi-support/stargazers">
      <img src="https://img.shields.io/github/stars/hellooops/vscode-edi-support?style=social" alt="GitHub stars" />
    </a>
  </p>
</div>

## Overview

EDI Support turns raw EDI text into something you can actually work with inside VS Code. It helps teams read transaction sets, understand segment meanings, navigate document structure, and clean up formatting without leaving the editor.

If you work with supplier integrations, logistics messages, healthcare transactions, or legacy B2B payloads, this extension is designed to make those files easier to inspect and safer to edit.

## ✨ Features

| Feature | What it helps with |
| :-- | :-- |
| 📄 Preview panel | Open a structured view of the current EDI document inside VS Code. |
| 🌈 Syntax highlighting | Make separators, segments, and document shape easier to scan. |
| 🩺 Diagnostics | Catch malformed content and common document issues earlier. |
| 💡 Inlay hints | Show segment names and qualifier details inline while reading. |
| 🗂️ EDI Support Explorer | Navigate interchange, group, transaction, and segment structure from the sidebar. |
| 🧹 Prettify and minify | Reformat dense payloads for readability or compact them again when needed. |
| 🔍 Hover descriptions | Inspect segment and element definitions without switching context. |
| 🔖 Document symbols | Jump quickly across large files with editor navigation support. |

## ⚡ Quick Start

### 1. Install from the VS Code Marketplace

1. Open the Extensions view in VS Code.
2. Search for `EDI Support`.
3. Install the extension published by `DericLee`.
4. Open an `.edi`, `.x12`, `.ansi`, `.edifact`, or `.vda` file.

Marketplace page: [EDI Support](https://marketplace.visualstudio.com/items?itemName=DericLee.edi-edifact-support)


## 📚 Supported Formats

- X12
- HIPAA
- EDIFACT
- VDA

## 🖼️ See It In Action

### Preview panel
<p><img src="./docs/images/edi-support-preview.png" alt="EDI document preview" /></p>

### Diagnostics
<p><img src="./docs/images/diagnostics.png" alt="EDI diagnostics" /></p>

### Inlay hints
<p><img src="./docs/images/inlayHints.png" alt="EDI inlay hints" /></p>

### Explorer view
<p><img src="./docs/images/edi-support-explorer.png" alt="EDI Support Explorer" /></p>

### Prettify
<p><img src="./docs/images/document-prettify.gif" alt="EDI prettify action" /></p>

### Minify
<p><img src="./docs/images/document-minify.gif" alt="EDI minify action" /></p>

### Segment hover
<p><img src="./docs/images/segment-hover.png" alt="Segment hover description" /></p>

### Element hover
<p><img src="./docs/images/element-hover.png" alt="Element hover description" /></p>


## ⚙️ Extension Settings

The extension works out of the box, but it also exposes a few useful settings:

### Display and editor assistance

- `ediSupport.enableTrailingAnnotations` (default: `true`): show trailing annotations.
- `ediSupport.enableCodelens` (default: `true`): enable or disable EDI code lenses.
- `ediSupport.enableLoopAnnotations` (default: `true`): enable or disable loop annotations.
- `ediSupport.enableHover` (default: `true`): enable or disable hover descriptions.
- `ediSupport.inlayHints.segmentNames` (default: `false`): show segment names as inlay hints.
- `ediSupport.inlayHints.qualifierCodes` (default: `false`): show qualifier codes as inlay hints.
- `ediSupport.vda.enableElementIndexAnnotation` (default: `true`): show VDA element indexes inline.
- `ediSupport.menu.icon` (default: `true`): show action icons in the editor title for X12 and EDIFACT files.

### Formatting

- `ediSupport.formatting.indentSegmentsInLoop` (default: `true`): indent segments inside loops when formatting.

### Schema customization

- `ediSupport.customSchemas`: add custom qualifier definitions. For EDIFACT service segments such as `UNA`, `UNB`, `UNG`, `UNE`, and `UNZ`, use `edifact._service.qualifiers`.

## 🤝 Feedback

Issues and feature requests are welcome at [GitHub Issues](https://github.com/hellooops/vscode-edi-support/issues).

## 🚧 Known Issues

No tracked issues are listed here right now. If you hit one, please open an issue with a sample document when possible.

## 📄 License

Licensed under the [MIT License](./LICENSE).
