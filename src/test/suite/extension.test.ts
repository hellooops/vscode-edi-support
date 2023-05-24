import * as assert from "assert";

import * as vscode from "vscode";
import { EdiMessage, EdiSegment, EdiVersion, EdifactParser, ElementType } from "../../parser";
import { EdiReleaseSchema } from "../../schemas/schemas";

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Edifact Parse Version", () => {
    const documentStr = "UNH+1+ORDERS:D:96A:UN:EAN008'";
    const parser: EdifactParser = new EdifactParser(documentStr);
    const ediVersion: EdiVersion = parser.parseReleaseAndVersion();

    assert.strictEqual(ediVersion.release, "D96A");
    assert.strictEqual(ediVersion.version, "ORDERS");
  });

  test("Edifact Parse Segment", async () => {
    const documentStr = "UNH+1+ORDERS:D:96A:UN:EAN008'";
    const parser: EdifactParser = new EdifactParser(documentStr);
    const segment: EdiSegment = await parser.parseSegment(documentStr, 0, documentStr.length - 1, "'");

    assert.strictEqual(segment.id, "UNH");
    assert.strictEqual(segment.elements.length, 2);
    assert.strictEqual(segment.endingDelimiter, "'");
    assert.strictEqual(segment.length, 29);
    assert.strictEqual(segment.startIndex, 0);
    assert.strictEqual(segment.endIndex, 28);

    // +1
    assert.strictEqual(segment.elements[0].designatorIndex, "01");
    assert.strictEqual(segment.elements[0].separator, "+");
    assert.strictEqual(segment.elements[0].startIndex, 3);
    assert.strictEqual(segment.elements[0].endIndex, 4);
    assert.strictEqual(segment.elements[0].type, ElementType.dataElement);
    assert.strictEqual(segment.elements[0].value, "1");
    assert.strictEqual(segment.elements[0].components, undefined);

    // +ORDERS:D:96A:UN:EAN008
    assert.strictEqual(segment.elements[1].designatorIndex, "02");
    assert.strictEqual(segment.elements[1].separator, "+");
    assert.strictEqual(segment.elements[1].startIndex, 5);
    assert.strictEqual(segment.elements[1].endIndex, 27);
    assert.strictEqual(segment.elements[1].type, ElementType.dataElement);
    assert.strictEqual(segment.elements[1].value, "ORDERS:D:96A:UN:EAN008");
    assert.strictEqual(segment.elements[1].components.length, 5);

    // +ORDERS
    assert.strictEqual(segment.elements[1].components[0].designatorIndex, "02-01");
    assert.strictEqual(segment.elements[1].components[0].separator, "+");
    assert.strictEqual(segment.elements[1].components[0].startIndex, 5);
    assert.strictEqual(segment.elements[1].components[0].endIndex, 11);
    assert.strictEqual(segment.elements[1].components[0].type, ElementType.componentElement);
    assert.strictEqual(segment.elements[1].components[0].value, "ORDERS");

    // :D
    assert.strictEqual(segment.elements[1].components[1].designatorIndex, "02-02");
    assert.strictEqual(segment.elements[1].components[1].separator, ":");
    assert.strictEqual(segment.elements[1].components[1].startIndex, 12);
    assert.strictEqual(segment.elements[1].components[1].endIndex, 13);
    assert.strictEqual(segment.elements[1].components[1].type, ElementType.componentElement);
    assert.strictEqual(segment.elements[1].components[1].value, "D");

    // :96A
    assert.strictEqual(segment.elements[1].components[2].designatorIndex, "02-03");
    assert.strictEqual(segment.elements[1].components[2].separator, ":");
    assert.strictEqual(segment.elements[1].components[2].startIndex, 14);
    assert.strictEqual(segment.elements[1].components[2].endIndex, 17);
    assert.strictEqual(segment.elements[1].components[2].type, ElementType.componentElement);
    assert.strictEqual(segment.elements[1].components[2].value, "96A");

    // :UN
    assert.strictEqual(segment.elements[1].components[3].designatorIndex, "02-04");
    assert.strictEqual(segment.elements[1].components[3].separator, ":");
    assert.strictEqual(segment.elements[1].components[3].startIndex, 18);
    assert.strictEqual(segment.elements[1].components[3].endIndex, 20);
    assert.strictEqual(segment.elements[1].components[3].type, ElementType.componentElement);
    assert.strictEqual(segment.elements[1].components[3].value, "UN");

    // :EAN008
    assert.strictEqual(segment.elements[1].components[4].designatorIndex, "02-05");
    assert.strictEqual(segment.elements[1].components[4].separator, ":");
    assert.strictEqual(segment.elements[1].components[4].startIndex, 21);
    assert.strictEqual(segment.elements[1].components[4].endIndex, 27);
    assert.strictEqual(segment.elements[1].components[4].type, ElementType.componentElement);
    assert.strictEqual(segment.elements[1].components[4].value, "EAN008");
  });

  test("Edifact Load Schema", async () => {
    const rawReleaseSchema = await import("./test-files/D96A-sample.json");
    const releaseSchema = new EdiReleaseSchema(rawReleaseSchema);
    assert.strictEqual(releaseSchema.release, "D96A");
    assert.strictEqual(releaseSchema.qualifiers["Process type identification"]["1"], "Wood preparation");

    const ADR = releaseSchema.segments["ADR"];
    assert.strictEqual(ADR.desc, "ADDRESS");
    assert.strictEqual(ADR.purpose, "To specify an address.");
    assert.strictEqual(ADR.elements.length, 7);

    const ADR01 = ADR.elements[0];
    assert.strictEqual(ADR01.id, "C817");
    assert.strictEqual(ADR01.desc, "ADDRESS USAGE");
    assert.strictEqual(ADR01.required, false);
    assert.strictEqual(ADR01.definition, "To describe the usage of an address.");
    assert.strictEqual(ADR01.components.length, 3);

    const ADR0101 = ADR01.components[0];
    assert.strictEqual(ADR0101.id, "3299");
    assert.strictEqual(ADR0101.desc, "Address purpose, coded");
    assert.strictEqual(ADR0101.dataType, "AN");
    assert.strictEqual(ADR0101.required, false);
    assert.strictEqual(ADR0101.minLength, 0);
    assert.strictEqual(ADR0101.maxLength, 3);
    assert.strictEqual(ADR0101.qualifierRef, "Address purpose, coded");
    assert.strictEqual(ADR0101.definition, "To specify the purpose of the address.");
  });

  // test("Edifact Parse Segments 1", async () => {
  //   // const releaseSchema = await import(`./schemas/D96A/RSSBus_D96A.json`);
  //   const releaseSchema = await import("../../schemas/D96A/RSSBus_D96A.json");
  //   const documentStr = "UNB+UNOA:2+<Sender GLN>:14+<Receiver GLN>:14+140407:0910+5++++1+EANCOM'UNH+1+ORDERS:D:96A:UN:EAN008'";
  //   const parser: EdifactParser = new EdifactParser(documentStr);
  //   const ediSegments: EdiSegment[] = await parser.parseSegments();

  //   assert.strictEqual(ediSegments.length, "<Sender GLN>");
  // });
});
