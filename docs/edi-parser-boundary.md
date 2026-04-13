# EDI Parser 拆包边界与目录结构

## 目标

将当前项目中的 EDI 解析核心提取为仓库内子包 `packages/edi-parser`，供：

1. 当前 VS Code 扩展内部复用
2. 外部非 VS Code 场景单独调用

本文件定义第一阶段的固定边界，后续实现不再重复决定“哪些代码属于新包”。

## 新包定位

新包只承载纯解析核心，不承载任何 VS Code 宿主能力。

新包职责：

- 识别 EDI 类型
- 创建具体 parser
- 解析 X12、EDIFACT、VDA 文本
- 提供 EDI 文档模型、segment/element/schema 类型
- 提供内置 schema 装载与可覆盖机制
- 提供基于纯数据结构的诊断能力

新包不承载：

- `vscode.TextDocument`
- `vscode.Range`
- `vscode.Position`
- `vscode.ThemeIcon`
- `vscode.workspace.getConfiguration`
- provider、command、webview、decoration、hover、tree、formatting 等扩展行为

## 最终目录结构

目标目录结构如下：

```text
packages/
  edi-parser/
    package.json
    tsconfig.json
    src/
      index.ts
      parser/
      schemas/
      utils/
      interfaces/
    scripts/
```

建议子目录职责如下：

- `src/parser`
  - parser 主类与解析流程
  - entities、scanner、version context
- `src/schemas`
  - schema 类型定义
  - message info 元数据
  - X12/EDIFACT/VDA schema JSON
- `src/utils`
  - parser 依赖的纯工具函数
- `src/interfaces`
  - 与 parser 直接相关、且不依赖 VS Code 的接口
- `src/index.ts`
  - 公共导出面
- `scripts`
  - schema 复制、构建辅助脚本

## 迁入新包的模块

第一阶段迁入：

- `src/parser/ediParserBase.ts`
- `src/parser/edifactParser.ts`
- `src/parser/x12Parser.ts`
- `src/parser/vdaParser.ts`
- `src/parser/entities.ts`
- `src/parser/segmentScanner.ts`
- `src/parser/schemaVersionSegmentsContext.ts`
- `src/schemas/schemas.ts`
- `src/schemas/edifact_d96a_meta.ts`
- `src/schemas/x12_00401_meta.ts`
- `src/schemas/edifact/**/*`
- `src/schemas/x12/**/*`
- `src/schemas/vda/**/*`
- `src/utils/utils.ts`
- `src/interfaces/messageInfo.ts`

迁入时允许的同步调整：

- 去除 `vscode` 依赖
- 将宿主配置读取改为 options 注入
- 将 schema 动态加载改为包内 resolver

## 保留在主项目的模块

明确保留在当前扩展仓库：

- `src/utils/ediUtils.ts`
  - 但它的 parser 创建逻辑将改为调用新包
- 所有 `src/providers/*`
- 所有 `src/commands/*`
- 所有 `src/decorations/*`
- 所有 `src/diagnostics/*`
- 所有 `src/webviews/*`
- `src/utils/vscodeUtils.ts`
- 任何直接依赖 `vscode` 的接口与类型

这些模块继续负责：

- `TextDocument` 适配
- `Range/Position` 计算
- editor language 切换
- VS Code 配置读取
- 图标、树视图、hover、格式化、预览等交互行为

## 兼容导出策略

第一阶段允许保留薄兼容层，但不允许保留双份事实来源。

兼容策略：

- 可以临时保留 `src/parser/*` 和 `src/schemas/schemas.ts` 作为 re-export 层
- 兼容层只能转发到 `edi-parser`
- 不允许继续在旧路径中维护独立实现

最终目标：

- 运行时代码统一从 `edi-parser` 导入
- 旧路径仅在过渡期服务测试或内部历史引用

## 事实来源规则

拆包后只允许一个 parser 核心事实来源：

- parser 实现事实来源：`packages/edi-parser/src`
- schema 事实来源：`packages/edi-parser/src/schemas`

主项目中的旧 parser/schema 文件如果保留，只能是转发层，不能继续承载真实逻辑。

## T001 完成判定

当以下条件满足时，T001 视为完成：

- 新包职责与非职责边界明确
- 最终目录结构明确
- 迁入/保留/兼容导出三类模块清单明确
- 后续实现者无需再决定“这个文件该不该进新包”
