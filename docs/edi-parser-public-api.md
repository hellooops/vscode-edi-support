# EDI Parser 公共 API 规格

## 目的

本文件用于完成 `T003`：在开始实际拆包前，先把 `packages/edi-parser` 的公共 API、类型边界和输入输出约定固定下来，避免在实现阶段反复修改导出面。

## 设计原则

- 公共 API 只接受纯字符串、纯对象、纯数据结构
- 不暴露任何 VS Code 类型
- 同时支持：
  - 默认内置 schema
  - 外部自定义 schema resolver
  - 主项目注入 custom schema / qualifier override
- 保持当前 parser 子类可直接实例化
- 对外部调用者提供比“直接 new parser”更简单的工厂 API

## 包名与入口

- 包名：`edi-parser`
- 主入口：`edi-parser`
- 推荐使用方式：
  - `import { detectEdiType, createParser, parseEdi } from "edi-parser"`
  - `import { X12Parser, EdifactParser, VdaParser } from "edi-parser"`

## v1 公共导出

### 工厂函数

#### `detectEdiType(text: string): EdiTypeValue`

用途：

- 仅根据原始文本识别 EDI 类型

返回值：

- `"x12"`
- `"edifact"`
- `"vda"`
- `"unknown"`

约定：

- 不抛出业务异常
- 空字符串或无法识别内容返回 `"unknown"`

#### `isX12(text: string): boolean`

#### `isEdifact(text: string): boolean`

#### `isVda(text: string): boolean`

用途：

- 对外暴露单独的类型判断逻辑

约定：

- 仅基于文本判断
- 不依赖宿主上下文

#### `createParser(text: string, options?: ParserOptions): EdiParserBase | undefined`

用途：

- 根据文本自动选择具体 parser

返回值：

- 命中时返回 `X12Parser | EdifactParser | VdaParser`
- 无法识别时返回 `undefined`

约定：

- 不在此处自动执行 parse
- 不在此处自动抛出“unknown document”错误

#### `parseEdi(text: string, options?: ParseOptions): Promise<EdiDocument | undefined>`

用途：

- 提供最直接的“一次性解析”入口

返回值：

- 识别成功时返回 `EdiDocument`
- 无法识别时返回 `undefined`

约定：

- 内部通过 `createParser(...).parse()` 完成
- 不引入 VS Code 相关副作用

### Parser 类

以下类需要作为公共导出保留：

- `EdiParserBase`
- `X12Parser`
- `EdifactParser`
- `VdaParser`

构造约定：

- `new X12Parser(text: string, options?: ParserOptions)`
- `new EdifactParser(text: string, options?: ParserOptions)`
- `new VdaParser(text: string, options?: ParserOptions)`

说明：

- 保留直接实例化能力，供外部调用方在已知类型场景下使用
- `options` 为新增第二参数
- `options` 可省略，确保兼容当前无参调用风格

### 文档模型与诊断类型

以下类型需要作为公共导出保留：

- `EdiType`
- `EdiMessageSeparators`
- `EdiDocument`
- `EdiInterchange`
- `EdiFunctionalGroup`
- `EdiTransactionSet`
- `EdiSegment`
- `EdiElement`
- `EdiComment`
- `ElementType`
- `EdiStandardOptions`
- `DiagnosticError`
- `DiagnosticErrorSeverity`
- `DiagnosticErrors`
- `DiagnoscticsContext`

说明：

- 当前扩展中的 tree、hover、semantic tokens、diagnostics 都依赖这些模型
- 新包必须继续输出这些模型，避免主项目自己复制类型

### Schema 相关类型与函数

以下 schema 类型需要作为公共导出保留：

- `EdiSchema`
- `EdiReleaseSchema`
- `EdiReleaseSchemaSegment`
- `EdiReleaseSchemaElement`
- `EdiVersionSchema`
- `EdiVersionSegment`
- `EdiQualifier`
- `getMessageInfo`

以下辅助函数作为 v1 公共 API：

#### `getBuiltInSchema(ediType: EdiTypeValue, release: string): unknown | undefined`

用途：

- 获取内置 release schema 原始数据

#### `loadBuiltInSchemaBundle(request: SchemaResolverRequest): SchemaLoadResult | undefined`

用途：

- 加载内置 release schema + version schema

说明：

- 该函数既可供内部使用，也可供外部调试/扩展使用

## Options 规格

### `type EdiTypeValue = "x12" | "edifact" | "vda" | "unknown"`

说明：

- `EdiType` 类可继续保留静态常量
- 对纯函数接口，统一使用字符串字面量语义

### `interface SchemaResolverRequest`

建议字段：

- `ediType: EdiTypeValue`
- `release: string`
- `version?: string`

语义：

- 描述一次 schema 查询请求

### `interface SchemaLoadResult`

建议字段：

- `releaseSchema: unknown`
- `versionSchema?: unknown`

语义：

- schema resolver 的标准返回结构

### `type SchemaResolver = (request: SchemaResolverRequest) => Promise<SchemaLoadResult | undefined> | SchemaLoadResult | undefined`

语义：

- 外部提供的 schema 装载器

返回约定：

- 返回有效对象：表示命中 schema
- 返回 `undefined`：表示未命中，由调用方按策略决定是否回退

### `interface ParserOptions`

v1 固定字段：

- `customSchemas?: Conf_CustomSchema`
- `qualifierOverrides?: Conf_CustomSchema`
- `schemaResolver?: SchemaResolver`

字段语义：

- `customSchemas`
  - 主项目从 VS Code 配置读到的自定义 qualifiers
  - 用于保持现有能力兼容
- `qualifierOverrides`
  - 给外部调用方直接注入覆盖项
  - 语义上等同于“额外追加或覆盖 qualifier”
- `schemaResolver`
  - 外部 schema 解析器

合并约定：

- qualifier 数据采用“显式注入优先于默认内置”的方向
- `customSchemas` 与 `qualifierOverrides` 都存在时，两者合并
- 合并时不丢失 EDIFACT `_service` 作用域

### `type ParseOptions = ParserOptions`

说明：

- v1 中 `parseEdi` 直接复用 `ParserOptions`
- 后续如果出现 parse-only 字段，再单独扩展

## 行为约定

### unknown 文档约定

- `detectEdiType` 返回 `"unknown"`
- `createParser` 返回 `undefined`
- `parseEdi` 返回 `undefined`

理由：

- 对外部消费者最温和
- 与当前扩展中“先识别，再决定是否继续”的流程相容

### schema 装载优先级

v1 固定优先级如下：

1. 外部 `schemaResolver`
2. 包内置 schema

未命中时：

- 返回 `false` / `undefined`
- 不因为“schema 不存在”而将 parse 整体直接判为异常

### qualifier 注入优先级

v1 固定语义如下：

1. 内置 schema qualifiers
2. `customSchemas`
3. `qualifierOverrides`

说明：

- 后注入的数据可以补充现有 qualifier/code
- 不要求在 v1 引入更复杂的冲突策略

## v1 明确不纳入公共 API 的能力

以下能力不属于 `edi-parser` v1 公共 API：

- `TextDocument` 适配函数
- `Range/Position` 计算函数
- `ThemeIcon`
- `setTextDocumentLanguage`
- 任何直接读取 VS Code 配置的入口
- provider、command、hover、tree、decoration、webview 相关逻辑

## 建议导出面

`src/index.ts` 建议只导出以下类别：

- 工厂 API
- parser 类
- 文档模型与诊断类型
- schema 类型与基础 helper
- options 与 resolver 类型

不建议直接导出：

- 仅供内部使用的路径 helper
- 仅供测试使用的内部函数
- 与构建脚本耦合的实现细节

## T003 完成判定

当以下条件满足时，T003 视为完成：

- 工厂 API 已固定
- parser 构造签名已固定
- options / resolver / schema 返回结构已固定
- v1 纳入与不纳入公共 API 的范围已固定
- 后续实现者无需再决定“这个类型要不要 export”
