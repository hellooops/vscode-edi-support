# edi-parser

`edi-parser` is the standalone parser package extracted from the `vscode-edi-support` extension. It focuses on pure parsing and schema loading for X12, EDIFACT and VDA, without any VS Code host dependency.

## What this package provides

- `detectEdiType(text)`: detect whether a document is `x12`, `edifact`, `vda` or `unknown`.
- `createParser(text, options)`: create the concrete parser instance.
- Built-in schema resources for X12, EDIFACT and VDA.
- Optional `customSchemas` and `schemaResolver` hooks for caller-side overrides.

## Install

Inside this monorepo-like repository, the root extension depends on it through:

```json
{
  "dependencies": {
    "edi-parser": "file:packages/edi-parser"
  }
}
```

To consume it from another local project before publishing to npm:

```bash
npm install D:\Dev\vscode-edi-support\packages\edi-parser
```

## Quick start

```js
const { createParser, detectEdiType } = require("edi-parser");

async function main() {
  const text = [
    "ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *241111*0300*U*00401*000000001*0*T*:~",
    "GS*PO*SENDER*RECEIVER*20241111*0300*1*X*004010~",
    "ST*850*0001~",
    "DTM*097*20150708~",
    "SE*3*0001~",
    "GE*1*1~",
    "IEA*1*000000001~",
  ].join("\n");

  console.log(detectEdiType(text));

  const parser = createParser(text);
  const document = await parser?.parse();
  console.log(document?.interchanges.length);
  console.log(document?.getSegments().map(segment => segment.id));
}

main().catch(console.error);
```

## Advanced usage

### `customSchemas`

Use `customSchemas` when you want to extend qualifier dictionaries without replacing the built-in schema bundle.

```js
const { X12Parser } = require("edi-parser");

new X12Parser(text, {
  customSchemas: {
    x12: {
      "00401": {
        qualifiers: {
          "Date/Time Qualifier": {
            ZZ: "Custom date qualifier",
          },
        },
      },
    },
  },
}).parse();
```

For EDIFACT control/service segments, use the `_service` scope:

```js
{
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
```

### `schemaResolver`

Use `schemaResolver` when you want to load schemas from your own storage, patch unsupported releases, or override the package defaults.

Resolver strategy is:

1. External `schemaResolver` runs first.
2. If it returns `undefined`, `edi-parser` falls back to its built-in schema resources.

```js
const { createParser, loadBuiltInSchemaBundle } = require("edi-parser");

const parser = createParser(text, {
  schemaResolver: request => {
    if (request.ediType === "x12" && request.release === "99999") {
      return loadBuiltInSchemaBundle({
        ediType: "x12",
        release: "00401",
        version: request.version,
      });
    }

    return undefined;
  },
});

parser?.parse();
```

If you want stronger typing for external schema bundles, use the exported raw schema types:

```ts
import type { RawReleaseSchema, RawVersionSchema, SchemaLoadResult } from "edi-parser";

const releaseSchema: RawReleaseSchema = {
  Release: "00401",
  Qualifiers: {},
  Segments: {},
};

const versionSchema: RawVersionSchema = {
  TransactionSet: [],
};

const bundle: SchemaLoadResult = {
  releaseSchema,
  versionSchema,
};
```

### `getMessageSeparators()`

When the EDI type is already known and you only need the separators, instantiate the concrete parser directly:

```js
const { X12Parser } = require("edi-parser");

const parser = new X12Parser(text);
const separators = parser.getMessageSeparators();

console.log(separators.segmentSeparator);
console.log(separators.dataElementSeparator);
console.log(separators.componentElementSeparator);
```

## Public exports

Main exports include:

- `detectEdiType`
- `createParser`
- `X12Parser`
- `EdifactParser`
- `VdaParser`
- `EdiDocument`, `EdiSegment`, `EdiElement`
- `getBuiltInSchema`
- `loadBuiltInSchemaBundle`

See [`src/index.ts`](./src/index.ts) for the full public export surface.

## Parse lifecycle

- `parser.parse()` returns a fresh `EdiDocument` for each completed call.
- Concurrent calls on the same parser instance are deduped while one parse is still in flight.
- If you want to reuse parsed results across UI refreshes or repeated commands, cache them in the caller layer.

## Development

Build the package:

```bash
npm --prefix packages/edi-parser run build
```

Run the package-only regression tests:

```bash
npm --prefix packages/edi-parser run test
```

## Notes for future publishing

- Keep `dist/**/*.js`, `dist/**/*.d.ts` and `dist/schemas/**/*` in the published package.
- If this package is moved out of the current repository, preserve the schema copy step in `scripts/copySchemas.js`.
- The extension currently still keeps thin compatibility re-exports in `src/parser/*` and `src/schemas/schemas.ts`; these are for migration safety, not the source of truth.
