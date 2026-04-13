# edi-parser

`edi-parser` is the standalone parser package extracted from the `vscode-edi-support` extension. It focuses on pure parsing and schema loading for X12, EDIFACT and VDA, without any VS Code host dependency.

## What this package provides

- `detectEdiType(text)`: detect whether a document is `x12`, `edifact`, `vda` or `unknown`.
- `createParser(text, options)`: create the concrete parser instance.
- `parseEdi(text, options)`: parse text directly and return an `EdiDocument`.
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
const { detectEdiType, parseEdi } = require("edi-parser");

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

  const document = await parseEdi(text);
  console.log(document?.interchanges.length);
  console.log(document?.getSegments().map(segment => segment.id));
}

main().catch(console.error);
```

## Advanced usage

### `customSchemas`

Use `customSchemas` when you want to extend qualifier dictionaries without replacing the built-in schema bundle.

```js
const { parseEdi } = require("edi-parser");

parseEdi(text, {
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
});
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
const { loadBuiltInSchemaBundle, parseEdi } = require("edi-parser");

parseEdi(text, {
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
```

## Public exports

Main exports include:

- `detectEdiType`
- `createParser`
- `parseEdi`
- `X12Parser`
- `EdifactParser`
- `VdaParser`
- `EdiDocument`, `EdiSegment`, `EdiElement`
- `getBuiltInSchema`
- `loadBuiltInSchemaBundle`

See [`src/index.ts`](./src/index.ts) for the full public export surface.

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
