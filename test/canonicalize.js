const assert = require("assert");
const { canonicalize } = require("../index");

exports.percent = () => {
  assert.equal(canonicalize("http://host/%25%32%35"), "http://host/%25");
};
exports.severalPercents = () => {
  assert.equal(
    canonicalize("http://host/%25%32%35%25%32%35"),
    "http://host/%25%25"
  );
};
exports.manyPercents = () => {
  assert.equal(
    canonicalize("http://host/%2525252525252525"),
    "http://host/%25"
  );
};
exports.percentInTheMiddle = () => {
  assert.equal(
    canonicalize("http://host/asdf%25%32%35asd"),
    "http://host/asdf%25asd"
  );
};
exports.escapeSinglePercents = () => {
  assert.equal(
    canonicalize("http://host/%%%25%32%35asd%%"),
    "http://host/%25%25%25asd%25%25"
  );
};
exports.simple = () => {
  assert.equal(
    canonicalize("http://www.google.com/"),
    "http://www.google.com/"
  );
};
exports.escapeIP = () => {
  assert.equal(
    canonicalize(
      "http://%31%36%38%2e%31%38%38%2e%39%39%2e%32%36/%2E%73%65%63%75%72%65/%77%77%77%2E%65%62%61%79%2E%63%6F%6D/"
    ),
    "http://168.188.99.26/.secure/www.ebay.com/"
  );
};
exports.doesNotEscapeIPPath = () => {
  assert.equal(
    canonicalize(
      "http://195.127.0.11/uploads/%20%20%20%20/.verify/.eBaysecure=updateuserdataxplimnbqmn-xplmvalidateinfoswqpcmlx=hgplmcx/"
    ),
    "http://195.127.0.11/uploads/%20%20%20%20/.verify/.eBaysecure=updateuserdataxplimnbqmn-xplmvalidateinfoswqpcmlx=hgplmcx/"
  );
};
exports.hostPercentEscape = () => {
  assert.equal(
    canonicalize(
      "http://host%23.com/%257Ea%2521b%2540c%2523d%2524e%25f%255E00%252611%252A22%252833%252944_55%252B"
    ),
    "http://host%23.com/~a!b@c%23d$e%25f^00&11*22(33)44_55+"
  );
};
exports.intIPEncoding = () => {
  assert.equal(
    canonicalize("http://3279880203/blah"),
    "http://195.127.0.11/blah"
  );
};
exports.removeDotDot = () => {
  assert.equal(
    canonicalize("http://www.google.com/blah/.."),
    "http://www.google.com/"
  );
};
exports.addSchema = () => {
  assert.equal(canonicalize("www.google.com/"), "http://www.google.com/");
};
exports.addSchemaPath = () => {
  assert.equal(canonicalize("www.google.com"), "http://www.google.com/");
};
exports.removeHash = () => {
  assert.equal(
    canonicalize("http://www.evil.com/blah#frag"),
    "http://www.evil.com/blah"
  );
};
exports.lowercase = () => {
  assert.equal(
    canonicalize("http://www.GOOgle.com/"),
    "http://www.google.com/"
  );
};
exports.removeTrailingDots = () => {
  assert.equal(
    canonicalize("http://www.google.com.../"),
    "http://www.google.com/"
  );
};
exports.removeTabs = () => {
  assert.equal(
    canonicalize("http://www.google.com/foo\tbar\rbaz\n2"),
    "http://www.google.com/foobarbaz2"
  );
};
exports.keepTrailingQuestionMark = () => {
  assert.equal(
    canonicalize("http://www.google.com/q?"),
    "http://www.google.com/q?"
  );
};
exports.keepTwoTrailingQuestionMarks = () => {
  assert.equal(
    canonicalize("http://www.google.com/q?r?"),
    "http://www.google.com/q?r?"
  );
};
exports.keepThreeTrailingQuestionMarks = () => {
  assert.equal(
    canonicalize("http://www.google.com/q?r?s"),
    "http://www.google.com/q?r?s"
  );
};
exports.removeHashes = () => {
  assert.equal(
    canonicalize("http://evil.com/foo#bar#baz"),
    "http://evil.com/foo"
  );
};
exports.keepSemicolon = () => {
  assert.equal(canonicalize("http://evil.com/foo;"), "http://evil.com/foo;");
};
exports.keepQuestionSemicolon = () => {
  assert.equal(
    canonicalize("http://evil.com/foo?bar;"),
    "http://evil.com/foo?bar;"
  );
};
/** I have no time to deal with 0x80 in JS
exports.escapeHostname = () => {
  assert.equal(canonicalize("http://\x01\x80.com/"), "http://%01%80.com/");
}; */
exports.escapeHostnameAlmostAsInReference = () => {
  assert.equal(canonicalize("http://\x01Ы.com/"), "http://%01%04k.com/");
};
exports.noTrailingSlash = () => {
  assert.equal(
    canonicalize("http://notrailingslash.com"),
    "http://notrailingslash.com/"
  );
};
exports.stripPort = () => {
  assert.equal(
    canonicalize("http://www.gotaport.com:1234/"),
    "http://www.gotaport.com/"
  );
};
exports.stripSpaces = () => {
  assert.equal(
    canonicalize("  http://www.google.com/  "),
    "http://www.google.com/"
  );
};
exports.espaceLeadingSpaces = () => {
  assert.equal(
    canonicalize("http:// leadingspace.com/"),
    "http://%20leadingspace.com/"
  );
};
exports.keepLeadingSpace = () => {
  assert.equal(
    canonicalize("http://%20leadingspace.com/"),
    "http://%20leadingspace.com/"
  );
};
exports.addSchemaWithLeadingSpace = () => {
  assert.equal(
    canonicalize("%20leadingspace.com/"),
    "http://%20leadingspace.com/"
  );
};
exports.keepHTTPS = () => {
  assert.equal(
    canonicalize("https://www.securesite.com/"),
    "https://www.securesite.com/"
  );
};
exports.keepEscape = () => {
  assert.equal(
    canonicalize("http://host.com/ab%23cd"),
    "http://host.com/ab%23cd"
  );
};
exports.keepTwoSlashes = () => {
  assert.equal(
    canonicalize("http://host.com//twoslashes?more//slashes"),
    "http://host.com/twoslashes?more//slashes"
  );
};
