import assert from "assert";
import { getPrefixes } from "../index.js";
import test from "node:test";

test("prefixes", function() {
  assert.deepEqual(
    getPrefixes("https://google.com/a/test/index.html?abc123", 32),
    new Set([
      Buffer.from([136, 152, 30, 98]),
      Buffer.from([166, 49, 51, 141]),
      Buffer.from([184, 40, 242, 237]),
      Buffer.from([24, 12, 238, 174]),
      Buffer.from([92, 148, 141, 10])
    ])
  );
});
