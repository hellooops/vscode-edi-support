# 单元测试缺口分析

## ✅ 已有测试覆盖

| 测试文件 | 覆盖内容 |
|---|---|
| `src/test/suite/x12.test.ts` | X12Parser 解析 meta、segments、separators、多 FG/TS、边界情况 |
| `src/test/suite/edifact.test.ts` | EdifactParser 解析 UNA/UNB/UNH、separators、schema 加载、转义字符 |
| `src/test/suite/vda.test.ts` | VdaParser 解析 meta、segments、element types |
| `src/test/suite/edi-comments.test.ts` | X12/EDIFACT 文档中的注释解析 |
| `src/test/suite/providers/documentFormattingEdiProvider.test.ts` | DocumentFormattingEditEdiProvider 基本逻辑 |
| `src/test/suite/providers/inlayHintsEdiProvider.test.ts` | InlayHintsEdiProvider 基本开关逻辑 |
| `src/test/suite/utils/utils.test.ts` | Utils/StringBuilder 纯函数与工具方法 |
| `src/test/suite/utils/ediUtils.test.ts` | EdiUtils 类型识别、parser 缓存、range/position 工具方法 |
| `src/test/suite/extension.test.ts` | Schema 集成、跨格式解析集成 |

---

## ❌ 缺失的单元测试（按优先级）

### 二、Providers（6 个完全未测试）

| Provider | 缺失的测试场景 |
|---|---|
| `hoverX12Provider.ts` / `hoverEdifactProvider.ts` / `hoverVdaProvider.ts` | 悬停时返回 segment/element 描述、qualifier 解释（各格式独立测试） |
| `completionItemEdiProvider.ts` | qualifier 代码自动补全列表 |
| `foldingRangeEdiProvider.ts` | Interchange/FG/TS 层级折叠范围正确性 |
| `documentSymbolsEdiProvider.ts` | 大纲视图中的 Symbol 层级 |
| `highlightEdiProvider.ts` | 光标所在 element 的高亮范围 |
| `codelensEdiProvider.ts` | 各 segment 的 CodeLens 显示 |
| `semanticTokensProvider.ts` | 语义 token 分类（segment id、element、component）|
| `codeActionEdiProvider.ts` | 代码操作建议（添加注释、qualifier 补全等）|
| `inlayHintsEdiX12Provider.ts` / `inlayHintsEdiEdifactProvider.ts` / `inlayHintsEdiVdaProvider.ts` | X12/EDIFACT/VDA 各自格式的 inlay hints 具体行为 |

### 三、Commands（10 个全部未测试）

`src/commands/` 目录下所有命令类均无测试：
- `ToggleLineCommentCommand` — 添加/删除行注释的逻辑
- `PrettifyDocumentCommand` / `MinifyDocumentCommand` — 格式化/压缩文档的文本变换
- `ToggleInlayHintsCommand`, `ToggleElementIndexAnnotationCommand`, `ToggleLoopAnnotationsCommand`, `ToggleIndentSegmentsInLoopCommand` — 配置开关行为
- `SelectTextByPositionCommand` — 按位置选中文本逻辑
- `AddCodeToQualifierCommand` — qualifier 注册逻辑

### 四、Diagnostics 诊断（已补充核心测试）

`src/diagnostics/ediDiagnostics.ts` 的 `EdiDiagnosticsMgr`：
- ✅ `ediDiagnosticsToVscodeDiagnostics()` — 已覆盖 severity 映射（Error/Warning）、默认范围、segment/element 范围与异常分支
- ✅ `refreshDiagnostics()` — 已覆盖不支持语言、parser 缺失、未知类型早退，以及解析+转换+写入诊断集合完整流程
- ✅ VDA 上下文行为 — 已覆盖 `ignoreRequired=true` 的诊断上下文传递

### 五、Entities 实体方法（部分覆盖，有缺口）

`src/parser/entities.ts` 中关键方法无直接测试：
- `EdiDocument.getErrors()` — 校验逻辑，生成 `DiagnosticError` 列表
- `EdiDocument.getFormatString()` — 格式化输出
- `EdiSegment.toString()` / `EdiElement.toString()` 等序列化方法
- `EdiFunctionalGroup.isFake()` 虽已在 edifact 测试中间接覆盖，但未直接测试

### 六、Decorations 装饰器（完全未测试）

`src/decorations/` 目录下 4 个文件无任何测试：
- `EdiDecorationsBeforeLineProvider` / `EdiDecorationsAfterLineProvider` — 行前/行后装饰逻辑

---

## 建议优先级

1. **高** — `EdiDiagnosticsMgr` 诊断类（业务核心逻辑）
2. **高** — Hover providers（用户体验核心，逻辑相对独立）
3. **中** — Commands（尤其 `ToggleLineCommentCommand`）
4. **中** — `FoldingRangeEdiProvider` / `DocumentSymbolsEdiProvider`（纯数据转换逻辑）
5. **低** — Decorations / SemanticTokens（依赖 VSCode 渲染 API，mock 成本高）
