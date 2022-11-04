import assert from "assert";
import { canonicalize } from "../index.js";
import test from "node:test";

test("percent", (t) => {
  assert.equal(canonicalize("http://host/%25%32%35"), "http://host/%25");
});
test("severalPercents", (t) => {
  assert.equal(
    canonicalize("http://host/%25%32%35%25%32%35"),
    "http://host/%25%25"
  );
});
test("manyPercents", (t) => {
  assert.equal(
    canonicalize("http://host/%2525252525252525"),
    "http://host/%25"
  );
});
test("percentInTheMiddle", (t) => {
  assert.equal(
    canonicalize("http://host/asdf%25%32%35asd"),
    "http://host/asdf%25asd"
  );
});
test("escapeSinglePercents", (t) => {
  assert.equal(
    canonicalize("http://host/%%%25%32%35asd%%"),
    "http://host/%25%25%25asd%25%25"
  );
});
test("simple", (t) => {
  assert.equal(
    canonicalize("http://www.google.com/"),
    "http://www.google.com/"
  );
});
test("escapeIP", (t) => {
  assert.equal(
    canonicalize(
      "http://%31%36%38%2e%31%38%38%2e%39%39%2e%32%36/%2E%73%65%63%75%72%65/%77%77%77%2E%65%62%61%79%2E%63%6F%6D/"
    ),
    "http://168.188.99.26/.secure/www.ebay.com/"
  );
});
test("doesNotEscapeIPPath", (t) => {
  assert.equal(
    canonicalize(
      "http://195.127.0.11/uploads/%20%20%20%20/.verify/.eBaysecure=updateuserdataxplimnbqmn-xplmvalidateinfoswqpcmlx=hgplmcx/"
    ),
    "http://195.127.0.11/uploads/%20%20%20%20/.verify/.eBaysecure=updateuserdataxplimnbqmn-xplmvalidateinfoswqpcmlx=hgplmcx/"
  );
});
test("hostPercentEscape", (t) => {
  assert.equal(
    canonicalize(
      "http://host%23.com/%257Ea%2521b%2540c%2523d%2524e%25f%255E00%252611%252A22%252833%252944_55%252B"
    ),
    "http://host%23.com/~a!b@c%23d$e%25f^00&11*22(33)44_55+"
  );
});
test("intIPEncoding", (t) => {
  assert.equal(
    canonicalize("http://3279880203/blah"),
    "http://195.127.0.11/blah"
  );
});
test("removeDotDot", (t) => {
  assert.equal(
    canonicalize("http://www.google.com/blah/.."),
    "http://www.google.com/"
  );
});
test("addSchema", (t) => {
  assert.equal(canonicalize("www.google.com/"), "http://www.google.com/");
});
test("addSchemaPath", (t) => {
  assert.equal(canonicalize("www.google.com"), "http://www.google.com/");
});
test("removeHash", (t) => {
  assert.equal(
    canonicalize("http://www.evil.com/blah#frag"),
    "http://www.evil.com/blah"
  );
});
test("lowercase", (t) => {
  assert.equal(
    canonicalize("http://www.GOOgle.com/"),
    "http://www.google.com/"
  );
});
test("removeTrailingDots", (t) => {
  assert.equal(
    canonicalize("http://www.google.com.../"),
    "http://www.google.com/"
  );
});
test("removeTabs", (t) => {
  assert.equal(
    canonicalize("http://www.google.com/foo\tbar\rbaz\n2"),
    "http://www.google.com/foobarbaz2"
  );
});
test("keepTrailingQuestionMark", (t) => {
  assert.equal(
    canonicalize("http://www.google.com/q?"),
    "http://www.google.com/q?"
  );
});
test("keepTwoTrailingQuestionMarks", (t) => {
  assert.equal(
    canonicalize("http://www.google.com/q?r?"),
    "http://www.google.com/q?r?"
  );
});
test("keepThreeTrailingQuestionMarks", (t) => {
  assert.equal(
    canonicalize("http://www.google.com/q?r?s"),
    "http://www.google.com/q?r?s"
  );
});
test("removeHashes", (t) => {
  assert.equal(
    canonicalize("http://evil.com/foo#bar#baz"),
    "http://evil.com/foo"
  );
});
test("keepSemicolon", (t) => {
  assert.equal(canonicalize("http://evil.com/foo;"), "http://evil.com/foo;");
});
test("keepQuestionSemicolon", (t) => {
  assert.equal(
    canonicalize("http://evil.com/foo?bar;"),
    "http://evil.com/foo?bar;"
  );
});
test("escapeHostname", (t) => {
  assert.equal(canonicalize("http://\x01\x80.com/"), "http://%01%80.com/");
});
test("noTrailingSlash", (t) => {
  assert.equal(
    canonicalize("http://notrailingslash.com"),
    "http://notrailingslash.com/"
  );
});
test("stripPort", (t) => {
  assert.equal(
    canonicalize("http://www.gotaport.com:1234/"),
    "http://www.gotaport.com/"
  );
});
test("stripSpaces", (t) => {
  assert.equal(
    canonicalize("  http://www.google.com/  "),
    "http://www.google.com/"
  );
});
test("espaceLeadingSpaces", (t) => {
  assert.equal(
    canonicalize("http:// leadingspace.com/"),
    "http://%20leadingspace.com/"
  );
});
test("keepLeadingSpace", (t) => {
  assert.equal(
    canonicalize("http://%20leadingspace.com/"),
    "http://%20leadingspace.com/"
  );
});
test("addSchemaWithLeadingSpace", (t) => {
  assert.equal(
    canonicalize("%20leadingspace.com/"),
    "http://%20leadingspace.com/"
  );
});
test("keepHTTPS", (t) => {
  assert.equal(
    canonicalize("https://www.securesite.com/"),
    "https://www.securesite.com/"
  );
});
test("keepEscape", (t) => {
  assert.equal(
    canonicalize("http://host.com/ab%23cd"),
    "http://host.com/ab%23cd"
  );
});
test("keepTwoSlashes", (t) => {
  assert.equal(
    canonicalize("http://host.com//twoslashes?more//slashes"),
    "http://host.com/twoslashes?more//slashes"
  );
});
test("shouldNotHangOnInvalidUnicode", (t) => {
  assert.equal(
    canonicalize("https://www.sample.com/path/text%2C-Float-%26%E2%80%A8-"),
    "https://www.sample.com/path/text,-Float-& -"
  );
});
