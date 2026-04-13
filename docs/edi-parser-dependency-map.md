# EDI Parser 运行时依赖图

## 目的

本文件用于完成 `T002`：把当前 parser 核心的运行时依赖、VS Code 耦合点，以及扩展侧的旧 import 入口全部固定下来，后续实施拆包时按此清单执行。

## 核心模块依赖关系

### parser 主干

- `src/parser/ediParserBase.ts`
  - 依赖 `src/parser/entities.ts`
  - 依赖 `src/parser/segmentScanner.ts`
  - 依赖 `src/parser/schemaVersionSegmentsContext.ts`
  - 依赖 `src/schemas/schemas.ts`
  - 依赖 `src/utils/utils.ts`
  - 依赖 `src/interfaces/configurations.ts`
  - 依赖 `src/constants.ts`
  - 当前直接依赖 `vscode`

- `src/parser/edifactParser.ts`
  - 依赖 `src/parser/ediParserBase.ts`
  - 依赖 `src/parser/entities.ts`
  - 依赖 `src/schemas/schemas.ts`
  - 依赖 `src/constants.ts`

- `src/parser/x12Parser.ts`
  - 依赖 `src/parser/ediParserBase.ts`
  - 依赖 `src/parser/entities.ts`
  - 依赖 `src/schemas/schemas.ts`
  - 依赖 `src/constants.ts`

- `src/parser/vdaParser.ts`
  - 依赖 `src/parser/ediParserBase.ts`
  - 依赖 `src/parser/entities.ts`

### parser 支撑模块

- `src/parser/entities.ts`
  - 依赖 `src/schemas/schemas.ts`
  - 依赖 `src/utils/utils.ts`
  - 依赖 `src/interfaces/messageInfo.ts`
  - 依赖 `src/interfaces/configurations.ts`
  - 依赖 `src/constants.ts`
  - 不直接依赖 `vscode`

- `src/parser/segmentScanner.ts`
  - 无外部宿主依赖

- `src/parser/schemaVersionSegmentsContext.ts`
  - 依赖 `src/parser/entities.ts`
  - 依赖 `src/schemas/schemas.ts`

### schema 与元数据

- `src/schemas/schemas.ts`
  - 依赖 `src/interfaces/messageInfo.ts`
  - 依赖 `src/schemas/edifact_d96a_meta.ts`
  - 依赖 `src/schemas/x12_00401_meta.ts`
  - 不直接依赖 `vscode`

- `src/schemas/edifact_d96a_meta.ts`
  - 依赖 `src/interfaces/messageInfo.ts`

- `src/schemas/x12_00401_meta.ts`
  - 依赖 `src/interfaces/messageInfo.ts`

## VS Code 耦合点

真正阻止 parser 直接拆包的运行时耦合点如下：

### 1. parser 内部直接读取 VS Code 配置

- 文件：`src/parser/ediParserBase.ts`
- 耦合行为：
  - 直接 `import * as vscode from "vscode"`
  - 在 `onSchemaLoaded()` 中通过 `vscode.workspace.getConfiguration(...)` 读取 `ediSupport.customSchemas`
- 结论：
  - 这是 parser 核心唯一必须拆除的 VS Code 运行时耦合点
  - 迁移时必须改为 `options` 注入

### 2. 扩展适配层持有 VS Code 文档与 UI 逻辑

- 文件：`src/utils/ediUtils.ts`
- 当前职责：
  - `TextDocument -> parser` 识别与创建
  - `setTextDocumentLanguage`
  - `ThemeIcon`
  - `Range/Position` 计算
- 结论：
  - 该文件必须保留在主项目
  - 仅替换其中 parser 来源为新包

### 3. custom schema 的宿主配置入口

当前 `ediSupport.customSchemas` 读取/写入分布在：

- `src/parser/ediParserBase.ts`
- `src/diagnostics/ediDiagnostics.ts`
- `src/commands/addCodeToQualifierCommand.ts`

结论：

- 新包中不能再读 VS Code 配置
- 主项目仍可继续从 VS Code 配置读写
- parser 使用方需要把配置值作为 options 传入新包

## 旧 import 入口范围

### 运行时代码

当前 `src` 下非测试代码中，直接引用旧 parser/schema 路径的文件规模为：

- 运行时代码命中数：`52`

这些入口主要分布在：

- `src/utils/ediUtils.ts`
- `src/diagnostics/*`
- `src/decorations/*`
- `src/providers/*`
- `src/webviews/webviewProvider.ts`

### 测试代码

当前测试代码中，直接引用旧 parser/schema 路径的文件规模为：

- 测试代码命中数：`24`

这些入口主要分布在：

- `src/test/suite/*.test.ts`
- `src/test/suite/parser/*.test.ts`
- `src/test/suite/utils/*.test.ts`
- `src/test/suite/providers/*.test.ts`

## 需要替换的主项目运行时入口

后续拆包时，优先替换这些文件中的旧 import：

- `src/utils/ediUtils.ts`
- `src/diagnostics/ediDiagnostics.ts`
- `src/decorations/ediDecorationsAfterLineProvider.ts`
- `src/providers/codeActionEdiProvider.ts`
- `src/providers/codelensEdiProvider.ts`
- `src/providers/completionItemEdiProvider.ts`
- `src/providers/documentFormattingEdiProvider.ts`
- `src/providers/documentSymbolsEdiProvider.ts`
- `src/providers/foldingRangeEdiProvider.ts`
- `src/providers/highlightEdiProvider.ts`
- `src/providers/hoverProviderBase.ts`
- `src/providers/hoverEdifactProvider.ts`
- `src/providers/hoverVdaProvider.ts`
- `src/providers/hoverX12Provider.ts`
- `src/providers/inlayHintsEdiProvider.ts`
- `src/providers/inlayHintsEdiEdifactProvider.ts`
- `src/providers/inlayHintsEdiVdaProvider.ts`
- `src/providers/inlayHintsEdiX12Provider.ts`
- `src/providers/semanticTokensProvider.ts`
- `src/providers/treeEdiProvider.ts`
- `src/utils/schemaViewerUtils.ts`
- `src/webviews/webviewProvider.ts`

## 新包迁移后推荐依赖形态

### 应迁入新包并保持内部依赖闭环

- `parser/*`
- `schemas/schemas.ts`
- `schemas/*_meta.ts`
- schema JSON 资源
- `utils/utils.ts`
- `interfaces/messageInfo.ts`

### 应继续留在主项目

- `utils/ediUtils.ts`
- `utils/vscodeUtils.ts`
- `diagnostics/*`
- `commands/*`
- `providers/*`
- `decorations/*`
- `webviews/*`

## 对 T003-T016 的直接影响

- `T003`
  - 公共 API 必须接收纯字符串与纯数据 options

- `T007`
  - 必须先拆掉 `EdiParserBase -> vscode.workspace.getConfiguration`

- `T015`
  - `EdiUtils` 成为唯一宿主适配层

- `T016`
  - 运行时代码统一改为 `import ... from "edi-parser"`

## T002 完成判定

当以下条件满足时，T002 视为完成：

- parser 主干依赖链路已经列清
- VS Code 耦合点已经明确
- 扩展侧旧 import 入口已经列清
- 后续实施者无需再自己搜索“哪些文件要切 import”
