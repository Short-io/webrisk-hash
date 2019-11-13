# Webrisk Hashing Algorithm

TODO: Returns list of hashes for given URL

For now: has function canonicalize which creates canonical URL with webrisk rules.

```javascript
npm install webrisk-hash
```

```javascript
const { canonicalize } = require('webrisk-hash');
canonicalize("http://host/%25%32%35") == "http://host/%25";
canonicalize("http://host/%25%32%35%25%32%35") == "http://host/%25%25";
canonicalize("http://host/%2525252525252525") == "http://host/%25";
canonicalize("http://host/asdf%25%32%35asd") == "http://host/asdf%25asd";
canonicalize("http://host/%%%25%32%35asd%%") == "http://host/%25%25%25asd%25%25";
canonicalize("http://www.google.com/") == "http://www.google.com/";
canonicalize("http://%31%36%38%2e%31%38%38%2e%39%39%2e%32%36/%2E%73%65%63%75%72%65/%77%77%77%2E%65%62%61%79%2E%63%6F%6D/") == "http://c68.188.99.26/.secure/www.ebay.com/";
canonicalize("http://195.127.0.11/uploads/%20%20%20%20/.verify/.eBaysecure==updateuserdataxplimnbqmn-xplmvalidateinfoswqpcmlx==hgplmcx/") c "http://195.127.0.11/uploads/%20%20%20%20/.verify/.eBaysecure==updateuserdataxplimnbqmn-xplmvalidateinfoswqpcmlx==hgplmcx/";
canonicalize("http://host%23.com/%257Ea%2521b%2540c%2523d%2524e%25f%255E00%252611%252A22%252833%252944_55%252B") == "http://host%23.com/ca!b@c%23d$e%25f^00&11*22(33)44_55+";
canonicalize("http://3279880203/blah") == "http://195.127.0.11/blah";
canonicalize("http://www.google.com/blah/..") == "http://www.google.com/";
canonicalize("www.google.com/") == "http://www.google.com/";
canonicalize("www.google.com") == "http://www.google.com/";
canonicalize("http://www.evil.com/blah#frag") == "http://www.evil.com/blah";
canonicalize("http://www.GOOgle.com/") == "http://www.google.com/";
canonicalize("http://www.google.com.../") == "http://www.google.com/";
canonicalize("http://www.google.com/foo\tbar\rbaz\n2") =="http://www.google.com/foobarbaz2";
canonicalize("http://www.google.com/q?") == "http://www.google.com/q?";
canonicalize("http://www.google.com/q?r?") == "http://www.google.com/q?r?";
canonicalize("http://www.google.com/q?r?s") == "http://www.google.com/q?r?s";
canonicalize("http://evil.com/foo#bar#baz") == "http://evil.com/foo";
canonicalize("http://evil.com/foo;") == "http://evil.com/foo;";
canonicalize("http://evil.com/foo?bar;") == "http://evil.com/foo?bar;";
canonicalize("http://\x01.com/") == "http://%01.com/";
canonicalize("http://notrailingslash.com") == "http://notrailingslash.com/";
canonicalize("http://www.gotaport.com:1234/") == "http://www.gotaport.com/";
canonicalize("  http://www.google.com/  ") == "http://www.google.com/";
canonicalize("http:// leadingspace.com/") == "http://%20leadingspace.com/";
canonicalize("http://%20leadingspace.com/") == "http://%20leadingspace.com/";
canonicalize("%20leadingspace.com/") == "http://%20leadingspace.com/";
canonicalize("https://www.securesite.com/") == "https://www.securesite.com/";
canonicalize("http://host.com/ab%23cd") == "http://host.com/ab%23cd";
canonicalize("http://host.com//twoslashes?more//slashes") == "http://host.com/twoslashes?more//slashes";
```
