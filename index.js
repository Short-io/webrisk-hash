import crypto from "crypto";
const URI_PARSE =
  /^(?:([^:\/?#]+):)?(?:\/\/((?:([^\/?#@]*)@)?(\[[^\/?#\]]+\]|[^\/?#:]*)(?:\:(\d*))?))?([^?#]*)(?:\?([^#]*))?(?:#((?:.|\n|\r)*))?/i; // regex for tokenising url from urijs module

const token = "%[a-f0-9]{2}";
const singleMatcher = new RegExp(token, "gi");
const multiMatcher = new RegExp("(" + token + ")+", "gi");

function decodeComponents(components, split) {
  try {
    // Try to decode the entire string first
    return [decodeURIComponent(components.join(""))];
  } catch (err) {
    // Do nothing
  }

  if (components.length === 1) {
    return components;
  }

  split = split || 1;

  // Split the array in 2 parts
  var left = components.slice(0, split);
  var right = components.slice(split);

  return Array.prototype.concat.call(
    [],
    decodeComponents(left),
    decodeComponents(right)
  );
}

function decode(input) {
  try {
    return decodeURIComponent(input);
  } catch (err) {
    var tokens = input.match(singleMatcher);

    for (var i = 1; i < (tokens ?? []).length; i++) {
      input = decodeComponents(tokens, i).join("");

      tokens = input.match(singleMatcher);
    }

    return input;
  }
}

function customDecodeURIComponent(input) {
  // Keep track of all the replacements and prefill the map with the `BOM`
  var replaceMap = {
    "%FE%FF": "\uFFFD\uFFFD",
    "%FF%FE": "\uFFFD\uFFFD",
  };

  var match = multiMatcher.exec(input);
  while (match) {
    try {
      // Decode as big chunks as possible
      replaceMap[match[0]] = decodeURIComponent(match[0]);
    } catch (err) {
      var result = decode(match[0]);

      if (result !== match[0]) {
        replaceMap[match[0]] = result;
      }
    }

    match = multiMatcher.exec(input);
  }

  // Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
  replaceMap["%C2"] = "\uFFFD";

  var entries = Object.keys(replaceMap);

  for (var i = 0; i < entries.length; i++) {
    // Replace all decoded components
    var key = entries[i];
    input = input.replace(new RegExp(key, "g"), replaceMap[key]);
  }

  return input;
}

function int2ip(ipInt) {
  return (
    (ipInt >>> 24) +
    "." +
    ((ipInt >> 16) & 255) +
    "." +
    ((ipInt >> 8) & 255) +
    "." +
    (ipInt & 255)
  );
}

function escapeCharacter(code) {
  const chr = String.fromCharCode(code);
  if (code < 16) return "%0" + code.toString(16);
  else if (
    (code <= 32 || code > 127 || chr === "%" || chr === "#") &&
    code < 256
  )
    return "%" + code.toString(16);
  else if (code >= 256) {
    return escapeCharacter(code >> 8) + escapeCharacter(code % 256);
  }
  return chr;
}

function webriskURIEscape(c) {
  return c.replace(/./g, (chr) => escapeCharacter(chr.charCodeAt(0)));
}

const normalizeIPAddress = (c) => {
  if (c.match(/^\d+$/)) {
    return int2ip(c);
  }
  return c;
};

const normalizeComponentEncoding = (c) => {
  let value = c;
  let prevValue;
  for (
    let infiniteLoopPreventor = 0;
    infiniteLoopPreventor < 1000;
    infiniteLoopPreventor++
  ) {
    prevValue = value;
    value = customDecodeURIComponent(prevValue).replace(/[\t\x0a\x0d]/g, "");
    if (value === prevValue) {
      break;
    }
  }
  return webriskURIEscape(value);
};

const normalizeDotsInPaths = (path) => {
  const pathParts = path
    .split("/")
    .filter(
      (el, index, arr) =>
        (el != "" || index === 0 || index === arr.length - 1) && el != "."
    )
    .filter((el, index, arr) => el != ".." && arr[index + 1] !== "..");
  return pathParts.join("/") || "/";
};

export const canonicalize = function (url) {
  const urlWithScheme = url.includes("://")
    ? url.trim()
    : "http://" + url.trim();
  const [, schema, , userinfo, host, , path, query] =
    urlWithScheme.match(URI_PARSE);
  if (!schema || !host || host.length > 255) {
    return null;
  }
  const normalizedHost = normalizeComponentEncoding(normalizeIPAddress(host))
    .replace(/\.+$/, "")
    .toLowerCase();
  const normalizedPath = normalizeComponentEncoding(normalizeDotsInPaths(path));
  const normalizedQuery = query !== undefined ? `?${query}` : "";
  
  return `${schema}://${normalizedHost}${normalizedPath}${normalizedQuery}`;
};

export const suffixPostfixExpressions = function (canonicalURL) {
  const [, schema, , userinfo, host, , path, query, fragment] =
    canonicalURL.match(URI_PARSE);
  const fullExpression = host + path;
  let iDomain = host;
  const res = [];
  while (iDomain.match(/.*\..*/) && !iDomain.match(/^(\d+\.){2}\d+$/)) {
    const domainRes = [];
    if (query) {
      domainRes.push(iDomain + path + "?" + query);
    }
    res.push(domainRes);
    let iPath = path;
    while (iPath.match(/\/.+/)) {
      domainRes.push(iDomain + iPath);
      iPath = iPath.replace(/[^/]*\/?$/, "");
    }
    domainRes.push(iDomain + "/");
    domainRes.splice(1, domainRes.length - 6);
    iDomain = iDomain.replace(/^.*?\./, "");
  }
  res.splice(1, res.length - 5);
  return new Set([].concat(...res));
};

export const truncatedSha256Prefix = (str, bits) => {
  const hash = crypto.createHash("sha256").update(str).digest();
  return hash.subarray(0, bits / 8);
};

export const getPrefixMap = (url, size = 32 * 8) => {
  const canonical = canonicalize(url);
  return Array.from(suffixPostfixExpressions(canonical)).map((url) => [
    url,
    truncatedSha256Prefix(url, size),
  ]);
};

export const getPrefixes = (url, size = 32 * 8) => {
  const canonical = canonicalize(url);
  return new Set(
    Array.from(suffixPostfixExpressions(canonical)).map((url) =>
      truncatedSha256Prefix(url, size)
    )
  );
};
