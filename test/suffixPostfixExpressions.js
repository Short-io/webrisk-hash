import assert from "assert";
import { suffixPostfixExpressions } from "../index.js";
import test from "node:test";

test("pathComponents", (t) => {
  assert.deepEqual(
    suffixPostfixExpressions("http://a.b.c/1/2.html?param=1"),
    new Set([
      "a.b.c/1/2.html?param=1",
      "a.b.c/1/2.html",
      "a.b.c/",
      "a.b.c/1/",
      "b.c/1/2.html?param=1",
      "b.c/1/2.html",
      "b.c/",
      "b.c/1/",
    ])
  );
});

test("pathComponentsForIP", (t) => {
  assert.deepEqual(
    suffixPostfixExpressions("http://192.168.0.1/1"),
    new Set(["192.168.0.1/1", "192.168.0.1/"])
  );
});

test("pathComponents", (t) => {
  assert.deepEqual(
    suffixPostfixExpressions("http://a.b.c/1/2/3/4/5/6/7/8.html?param=1"),
    new Set([
      "a.b.c/1/2/3/4/5/6/7/8.html?param=1",
      "a.b.c/1/2/3/4/",
      "a.b.c/1/2/3/",
      "a.b.c/1/2/",
      "a.b.c/1/",
      "a.b.c/",
      "b.c/1/2/3/4/5/6/7/8.html?param=1",
      "b.c/1/2/3/4/",
      "b.c/1/2/3/",
      "b.c/1/2/",
      "b.c/1/",
      "b.c/",
    ])
  );
});

test("sixLevelSubdomain", (t) => {
  assert.deepEqual(
    suffixPostfixExpressions("http://a.b.c.d.e.f.g/1.html"),
    new Set([
      "a.b.c.d.e.f.g/1.html",
      "a.b.c.d.e.f.g/",
      // (Note: skip b.c.d.e.f.g, since we'll take only the last five hostname components, and the full hostname)
      "c.d.e.f.g/1.html",
      "c.d.e.f.g/",
      "d.e.f.g/1.html",
      "d.e.f.g/",
      "e.f.g/1.html",
      "e.f.g/",
      "f.g/1.html",
      "f.g/",
    ])
  );
});

test("sevenLevelSubdomain", (t) => {
  assert.deepEqual(
    suffixPostfixExpressions("http://x.a.b.c.d.e.f.g/1.html"),
    new Set([
      "x.a.b.c.d.e.f.g/1.html",
      "x.a.b.c.d.e.f.g/",
      // (Note: skip b.c.d.e.f.g, since we'll take only the last five hostname components, and the full hostname)
      "c.d.e.f.g/1.html",
      "c.d.e.f.g/",
      "d.e.f.g/1.html",
      "d.e.f.g/",
      "e.f.g/1.html",
      "e.f.g/",
      "f.g/1.html",
      "f.g/",
    ])
  );
});
