import * as assert from "assert";

import * as vscode from "vscode";
import { EdiSegment, EdifactParser, ElementType } from "../../parser";

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Edifact Parse Segment", () => {
    const parser: EdifactParser = new EdifactParser();
    const segmentStr = "UNH+1+ORDERS:D:96A:UN:EAN008'";
    const segment: EdiSegment = parser.parseSegment(segmentStr, 0, segmentStr.length - 1, "'");

    assert.strictEqual(segment.id, "UNH");
    assert.strictEqual(segment.elements.length, 6);
    assert.strictEqual(segment.endingDelimiter, "'");
    assert.strictEqual(segment.length, 29);
    assert.strictEqual(segment.startIndex, 0);
    assert.strictEqual(segment.endIndex, 28);

    // +1
    assert.strictEqual(segment.elements[0].name, "01");
    assert.strictEqual(segment.elements[0].separator, "+");
    assert.strictEqual(segment.elements[0].startIndex, 3);
    assert.strictEqual(segment.elements[0].endIndex, 4);
    assert.strictEqual(segment.elements[0].type, ElementType.dataElement);
    assert.strictEqual(segment.elements[0].value, "1");

    // +ORDERS
    assert.strictEqual(segment.elements[1].name, "02");
    assert.strictEqual(segment.elements[1].separator, "+");
    assert.strictEqual(segment.elements[1].startIndex, 5);
    assert.strictEqual(segment.elements[1].endIndex, 11);
    assert.strictEqual(segment.elements[1].type, ElementType.dataElement);
    assert.strictEqual(segment.elements[1].value, "ORDERS");

    // :D
    assert.strictEqual(segment.elements[2].name, "02-01");
    assert.strictEqual(segment.elements[2].separator, ":");
    assert.strictEqual(segment.elements[2].startIndex, 12);
    assert.strictEqual(segment.elements[2].endIndex, 13);
    assert.strictEqual(segment.elements[2].type, ElementType.componentElement);
    assert.strictEqual(segment.elements[2].value, "D");

    // :96A
    assert.strictEqual(segment.elements[3].name, "02-02");
    assert.strictEqual(segment.elements[3].separator, ":");
    assert.strictEqual(segment.elements[3].startIndex, 14);
    assert.strictEqual(segment.elements[3].endIndex, 17);
    assert.strictEqual(segment.elements[3].type, ElementType.componentElement);
    assert.strictEqual(segment.elements[3].value, "96A");

    // :UN
    assert.strictEqual(segment.elements[4].name, "02-03");
    assert.strictEqual(segment.elements[4].separator, ":");
    assert.strictEqual(segment.elements[4].startIndex, 18);
    assert.strictEqual(segment.elements[4].endIndex, 20);
    assert.strictEqual(segment.elements[4].type, ElementType.componentElement);
    assert.strictEqual(segment.elements[4].value, "UN");

    // :EAN008
    assert.strictEqual(segment.elements[5].name, "02-04");
    assert.strictEqual(segment.elements[5].separator, ":");
    assert.strictEqual(segment.elements[5].startIndex, 21);
    assert.strictEqual(segment.elements[5].endIndex, 27);
    assert.strictEqual(segment.elements[5].type, ElementType.componentElement);
    assert.strictEqual(segment.elements[5].value, "EAN008");
  });
});
