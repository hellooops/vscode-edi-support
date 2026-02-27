import * as assert from "assert";
import Utils, { StringBuilder } from "../../../utils/utils";

suite("Utils Test Suite", () => {
  test("yyMMddFormat should format valid date", () => {
    assert.strictEqual(Utils.yyMMddFormat("140407"), "14-04-07");
  });

  test("yyMMddFormat should return original value when invalid", () => {
    assert.strictEqual(Utils.yyMMddFormat(""), "");
    assert.strictEqual(Utils.yyMMddFormat("1404"), "1404");
  });

  test("HHmmFormat should format HHmm and HHmmss", () => {
    assert.strictEqual(Utils.HHmmFormat("0910"), "09:10");
    assert.strictEqual(Utils.HHmmFormat("091035"), "09:10:35");
  });

  test("HHmmFormat should return original value when too short", () => {
    assert.strictEqual(Utils.HHmmFormat("09"), "09");
  });

  test("toString should keep null and undefined", () => {
    assert.strictEqual(Utils.toString(null), null);
    assert.strictEqual(Utils.toString(undefined), undefined);
  });

  test("toString should stringify primitives", () => {
    assert.strictEqual(Utils.toString(123), "123");
    assert.strictEqual(Utils.toString(true), "true");
  });

  test("formatString should replace placeholders", () => {
    assert.strictEqual(Utils.formatString("Hello {0}, {1}!", "EDI", "World"), "Hello EDI, World!");
  });

  test("formatString should fallback missing placeholders to empty string", () => {
    assert.strictEqual(Utils.formatString("{0}-{1}-{2}", "A", "B"), "A-B-");
  });

  test("getStringAsInt should parse numbers and strings", () => {
    assert.strictEqual(Utils.getStringAsInt(3.9), 3);
    assert.strictEqual(Utils.getStringAsInt("42"), 42);
    assert.strictEqual(Utils.getStringAsInt("42abc"), 42);
  });

  test("getStringAsInt should support default and invalid inputs", () => {
    assert.strictEqual(Utils.getStringAsInt(undefined, 8), 8);
    assert.strictEqual(Utils.getStringAsInt("", 9), 9);
    assert.strictEqual(Utils.getStringAsInt("abc"), undefined);
  });

  test("getValueAsBoolean should parse common string values", () => {
    assert.strictEqual(Utils.getValueAsBoolean("true"), true);
    assert.strictEqual(Utils.getValueAsBoolean("1"), true);
    assert.strictEqual(Utils.getValueAsBoolean("on"), true);
    assert.strictEqual(Utils.getValueAsBoolean("false"), false);
  });

  test("getValueAsBoolean should support default and truthy values", () => {
    assert.strictEqual(Utils.getValueAsBoolean(undefined, true), true);
    assert.strictEqual(Utils.getValueAsBoolean("", false), false);
    assert.strictEqual(Utils.getValueAsBoolean(5), true);
    assert.strictEqual(Utils.getValueAsBoolean(0), false);
  });

  test("randomId should return non-empty ids", () => {
    const id1 = Utils.randomId();
    const id2 = Utils.randomId();

    assert.strictEqual(typeof id1, "string");
    assert.strictEqual(id1.length > 0, true);
    assert.strictEqual(id1 === id2, false);
  });
});

suite("StringBuilder Test Suite", () => {
  test("append should support chaining and toString should join values", () => {
    const sb = new StringBuilder();
    const result = sb.append("EDI").append("-").append("X12").toString();

    assert.strictEqual(result, "EDI-X12");
  });
});
