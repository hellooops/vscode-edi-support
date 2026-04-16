# edi-parser Public API Demo

这份文档只做一件事：给 `packages/edi-parser/src/index.ts` 当前公开导出的每个 API 一个最小示例。

为了避免每段都重复，先约定几段公共示例输入：

```ts
const x12Text = [
  "ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *241111*0300*U*00401*000000001*0*T*:~",
  "GS*PO*SENDER*RECEIVER*20241111*0300*1*X*004010~",
  "ST*850*0001~",
  "BEG*00*DS*PO1**20150708~",
  "SE*3*0001~",
  "GE*1*1~",
  "IEA*1*000000001~"
].join("\n");

const edifactText = [
  "UNA:+.?*'",
  "UNB+UNOA:2+SENDER:14+RECEIVER:14+240101:1200+1'",
  "UNH+1+ORDERS:D:96A:UN'",
  "BGM+220+PO1+9'",
  "UNT+2+1'",
  "UNZ+1+1'"
].join("\n");

const vdaText = "51102                  9999900001250124111231                                                                                         \n";
```

## 工厂函数

### `detectEdiType`

```ts
import { detectEdiType } from "edi-parser";

console.log(detectEdiType(x12Text));     // "x12"
console.log(detectEdiType(edifactText)); // "edifact"
console.log(detectEdiType("plain text"));// "unknown"
```

### `isX12`

```ts
import { isX12 } from "edi-parser";

console.log(isX12(x12Text));     // true
console.log(isX12(edifactText)); // false
```

### `isEdifact`

```ts
import { isEdifact } from "edi-parser";

console.log(isEdifact(edifactText)); // true
console.log(isEdifact(x12Text));     // false
```

### `isVda`

```ts
import { isVda } from "edi-parser";

console.log(isVda(vdaText));    // true
console.log(isVda(x12Text));    // false
```

### `createParser`

```ts
import { createParser } from "edi-parser";

const parser = createParser(x12Text, {
  customSchemas: {
    x12: {
      "00401": {
        qualifiers: {
          "Date/Time Qualifier": {
            ZZ: "Custom date qualifier"
          }
        }
      }
    }
  }
});

if (parser) {
  const document = await parser.parse();
  console.log(document.getSegments(true).map(s => s.id));
}
```

### `parseEdi`

```ts
import { parseEdi } from "edi-parser";

const document = await parseEdi(edifactText, {
  customSchemas: {
    edifact: {
      _service: {
        qualifiers: {
          "Identification code qualifier": {
            ZZ: "Mutually agreed qualifier"
          }
        }
      }
    }
  }
});

console.log(document?.interchanges.length);
```

## 内置 Schema Helper

### `getBuiltInSchema`

```ts
import { getBuiltInSchema } from "edi-parser";

const releaseSchema = getBuiltInSchema("x12", "00401");
console.log(Boolean(releaseSchema));
```

### `loadBuiltInSchemaBundle`

```ts
import { loadBuiltInSchemaBundle } from "edi-parser";

const bundle = loadBuiltInSchemaBundle({
  ediType: "x12",
  release: "00401",
  version: "850"
});

console.log(Boolean(bundle?.releaseSchema));
console.log(Boolean(bundle?.versionSchema));
```

## 类型导出

### `EdiTypeValue`

```ts
import type { EdiTypeValue } from "edi-parser";

const typeName: EdiTypeValue = "x12";
```

### `EdiErrorOptions`

```ts
import type { EdiErrorOptions } from "edi-parser";

const errorOptions: EdiErrorOptions = {
  ignoreRequired: true
};
```

### `EdiValidationOptions`

```ts
import type { EdiValidationOptions } from "edi-parser";

const validationOptions: EdiValidationOptions = {
  customSchemas: {
    x12: {
      "00401": {
        qualifiers: {
          "Reference qualifier": {
            ZZ: "Custom ref"
          }
        }
      }
    }
  }
};
```

### `ParseOptions`

```ts
import type { ParseOptions } from "edi-parser";

const parseOptions: ParseOptions = {
  customSchemas: {
    edifact: {
      _service: {
        qualifiers: {
          "Identification code qualifier": {
            ZZ: "Custom code"
          }
        }
      }
    }
  }
};
```

### `ParserOptions`

```ts
import type { ParserOptions } from "edi-parser";

const parserOptions: ParserOptions = {
  schemaResolver: async () => undefined
};
```

### `SchemaLoadResult`

```ts
import type { SchemaLoadResult } from "edi-parser";

const result: SchemaLoadResult = {
  releaseSchema: { Release: "00401" },
  versionSchema: { TransactionSet: {} }
};
```

### `SchemaResolver`

```ts
import type { SchemaResolver } from "edi-parser";

const resolver: SchemaResolver = async (request) => {
  if (request.ediType === "x12" && request.release === "00401") {
    return {
      releaseSchema: { Release: "00401" },
      versionSchema: { TransactionSet: {} }
    };
  }
  return undefined;
};
```

### `SchemaResolverRequest`

```ts
import type { SchemaResolverRequest } from "edi-parser";

const request: SchemaResolverRequest = {
  ediType: "x12",
  release: "00401",
  version: "850"
};
```

## Parser 类

### `EdiParserBase`

```ts
import { createParser, EdiParserBase } from "edi-parser";

const parser = createParser(x12Text) as EdiParserBase | undefined;
const document = await parser?.parse();
console.log(document?.getSegments(true).length);
```

### `X12Parser`

```ts
import { X12Parser } from "edi-parser";

const parser = new X12Parser(x12Text);
const document = await parser.parse();
console.log(document.interchanges[0].functionalGroups[0].transactionSets[0].meta.version);
```

### `EdifactParser`

```ts
import { EdifactParser } from "edi-parser";

const parser = new EdifactParser(edifactText);
const document = await parser.parse();
console.log(document.separatorsSegment?.id);
```

### `VdaParser`

```ts
import { VdaParser } from "edi-parser";

const parser = new VdaParser(vdaText);
const document = await parser.parse();
console.log(document.interchanges.length);
```

## 文档模型与枚举

### `DiagnosticErrors`

```ts
import { DiagnosticErrors } from "edi-parser";

console.log(DiagnosticErrors.VALUE_REQUIRED);
console.log(DiagnosticErrors.QUALIFIER_INVALID_CODE);
```

### `DiagnosticErrorSeverity`

```ts
import { DiagnosticErrorSeverity } from "edi-parser";

console.log(DiagnosticErrorSeverity.ERROR);
console.log(DiagnosticErrorSeverity.WARNING);
```

### `EdiComment`

```ts
import { EdiComment } from "edi-parser";

const comment = new EdiComment(0, 8, "// comment");
console.log(comment.getFormatString());
```

### `EdiDocument`

```ts
import {
  EdiDocument,
  EdiDocumentSeparators,
  EdiType
} from "edi-parser";

const document = new EdiDocument(
  new EdiDocumentSeparators(),
  EdiType.X12,
  {
    interchangeStartSegmentName: "ISA",
    interchangeEndSegmentName: "IEA",
    functionalGroupStartSegmentName: "GS",
    functionalGroupEndSegmentName: "GE",
    transactionSetStartSegmentName: "ST",
    transactionSetEndSegmentName: "SE"
  }
);

console.log(document.getErrors());
```

### `EdiDocumentBuilder`

```ts
import {
  EdiDocumentBuilder,
  EdiDocumentSeparators,
  EdiSegment,
  EdiType
} from "edi-parser";

const builder = new EdiDocumentBuilder(
  new EdiDocumentSeparators(),
  EdiType.X12,
  {
    transactionSetStartSegmentName: "ST",
    transactionSetEndSegmentName: "SE"
  }
);

builder.onParseTransactionSetMeta(() => ({
  id: "0001",
  release: "00401",
  version: "850"
}));

await builder.addSegment(new EdiSegment("ST", 0, 9, 10, "~"));
await builder.addSegment(new EdiSegment("SE", 10, 19, 10, "~"));

const document = builder.buildEdiDocument();
console.log(document.interchanges.length);
```

### `EdiDocumentSeparators`

```ts
import { EdiDocumentSeparators } from "edi-parser";

const separators = new EdiDocumentSeparators();
separators.segmentSeparator = "~";
separators.dataElementSeparator = "*";
separators.componentElementSeparator = ":";
```

### `EdiElement`

```ts
import {
  EdiElement,
  EdiSegment,
  ElementType
} from "edi-parser";

const segment = new EdiSegment("REF", 0, 8, 9, "~");
const element = new EdiElement(
  segment,
  ElementType.dataElement,
  1,
  3,
  "*",
  "REF",
  0,
  "01"
);

element.value = "ZZ";
console.log(element.getDesignator());
```

### `EdiFunctionalGroup`

```ts
import {
  EdiDocument,
  EdiDocumentSeparators,
  EdiFunctionalGroup,
  EdiInterchange,
  EdiType
} from "edi-parser";

const document = new EdiDocument(new EdiDocumentSeparators(), EdiType.X12, {});
const interchange = new EdiInterchange({ id: "I1" }, document);
const group = new EdiFunctionalGroup({ id: "G1" }, interchange);

console.log(group.getId());
```

### `EdiInterchange`

```ts
import {
  EdiDocument,
  EdiDocumentSeparators,
  EdiInterchange,
  EdiType
} from "edi-parser";

const document = new EdiDocument(new EdiDocumentSeparators(), EdiType.X12, {});
const interchange = new EdiInterchange({ id: "0001" }, document);

console.log(interchange.getId());
```

### `EdiMessageSeparators`

```ts
import { EdiMessageSeparators } from "edi-parser";

const separators = new EdiMessageSeparators();
separators.segmentSeparator = "~";
separators.dataElementSeparator = "*";
separators.componentElementSeparator = ":";
```

### `EdiSegment`

```ts
import { EdiSegment } from "edi-parser";

const segment = new EdiSegment("REF", 0, 8, 9, "~");
console.log(segment.id);
console.log(segment.getErrors());
```

### `EdiTransactionSet`

```ts
import {
  EdiDocument,
  EdiDocumentSeparators,
  EdiFunctionalGroup,
  EdiInterchange,
  EdiTransactionSet,
  EdiType
} from "edi-parser";

const document = new EdiDocument(new EdiDocumentSeparators(), EdiType.X12, {});
const interchange = new EdiInterchange({ id: "I1" }, document);
const group = new EdiFunctionalGroup({ id: "G1" }, interchange);
const transactionSet = new EdiTransactionSet({ id: "0001", release: "00401", version: "850" }, group);

console.log(transactionSet.getId());
```

### `EdiType`

```ts
import { EdiType } from "edi-parser";

console.log(EdiType.X12);
console.log(EdiType.EDIFACT);
console.log(EdiType.VDA);
console.log(EdiType.UNKNOWN);
```

### `ElementType`

```ts
import { ElementType } from "edi-parser";

console.log(ElementType.dataElement);
console.log(ElementType.componentElement);
```

## 诊断类型

### `DiagnosticError`

```ts
import type { DiagnosticError, DiagnosticErrorSeverity } from "edi-parser";

const error: DiagnosticError = {
  error: "Something went wrong",
  code: "TEST",
  severity: DiagnosticErrorSeverity.ERROR
};
```

### `DiagnosticError_QUALIFIER_INVALID_CODE`

```ts
import type {
  DiagnosticErrorSeverity,
  DiagnosticError_QUALIFIER_INVALID_CODE
} from "edi-parser";

const error: DiagnosticError_QUALIFIER_INVALID_CODE = {
  error: "Invalid qualifier code",
  code: "Edi Support: Qualifier invalid code",
  severity: DiagnosticErrorSeverity.ERROR,
  others: {
    ediType: "x12",
    release: "00401",
    qualifier: "Reference qualifier",
    code: "ZZ"
  }
};
```

### `EdiFunctionalGroupMeta`

```ts
import type { EdiFunctionalGroupMeta } from "edi-parser";

const meta: EdiFunctionalGroupMeta = {
  date: "20241111",
  time: "0300",
  id: "1"
};
```

### `EdiInterchangeMeta`

```ts
import type { EdiInterchangeMeta } from "edi-parser";

const meta: EdiInterchangeMeta = {
  id: "000000001"
};
```

### `EdiStandardOptions`

```ts
import type { EdiStandardOptions } from "edi-parser";

const options: EdiStandardOptions = {
  interchangeStartSegmentName: "ISA",
  interchangeEndSegmentName: "IEA",
  functionalGroupStartSegmentName: "GS",
  functionalGroupEndSegmentName: "GE",
  transactionSetStartSegmentName: "ST",
  transactionSetEndSegmentName: "SE"
};
```

### `EdiTransactionSetMeta`

```ts
import type { EdiTransactionSetMeta } from "edi-parser";

const meta: EdiTransactionSetMeta = {
  release: "00401",
  version: "850",
  id: "0001"
};
```

## Schema 模型

### `EdiQualifier`

```ts
import { EdiQualifier } from "edi-parser";

const qualifier = new EdiQualifier("ZZ", "Custom qualifier");
console.log(qualifier.value);
```

### `EdiReleaseSchema`

```ts
import { EdiReleaseSchema } from "edi-parser";

const schema = new EdiReleaseSchema({
  Release: "00401",
  Segments: {}
} as any);

console.log(schema.Release);
```

### `EdiReleaseSchemaElement`

```ts
import { EdiReleaseSchemaElement } from "edi-parser";

const element = new EdiReleaseSchemaElement({
  id: "128",
  desc: "Reference qualifier"
} as any);

console.log(element.id);
```

### `EdiReleaseSchemaSegment`

```ts
import { EdiReleaseSchemaSegment } from "edi-parser";

const segment = new EdiReleaseSchemaSegment({
  id: "REF",
  desc: "Reference"
} as any);

console.log(segment.id);
```

### `EdiSchema`

```ts
import { EdiSchema } from "edi-parser";

const schema = new EdiSchema(
  { Release: "00401", Segments: {} } as any,
  { TransactionSet: {} } as any
);

console.log(Boolean(schema.releaseSchema));
```

### `EdiVersionSchema`

```ts
import { EdiVersionSchema } from "edi-parser";

const schema = new EdiVersionSchema({
  TransactionSet: {}
} as any);

console.log(Boolean(schema.TransactionSet));
```

### `EdiVersionSegment`

```ts
import { EdiVersionSegment } from "edi-parser";

const versionSegment = new EdiVersionSegment({
  ID: "REF"
} as any);

console.log(versionSegment.ID);
```

### `getMessageInfo`

```ts
import { getMessageInfo } from "edi-parser";

console.log(getMessageInfo("850"));
console.log(getMessageInfo("ORDERS"));
```
