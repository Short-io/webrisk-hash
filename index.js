const URI = require("uri-js");
const decodeUriComponent = require('decode-uri-component');
const punycode = require('punycode');
var token = '%[a-f0-9]{2}';
var singleMatcher = new RegExp(token, 'gi');
var multiMatcher = new RegExp('(' + token + ')+', 'gi');

function decodeComponents(components, split) {
	try {
		// Try to decode the entire string first
		return decodeURIComponent(components.join(''));
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

	return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
}

function decode(input) {
	try {
		return decodeURIComponent(input);
	} catch (err) {
		var tokens = input.match(singleMatcher);

		for (var i = 1; i < tokens.length; i++) {
			input = decodeComponents(tokens, i).join('');

			tokens = input.match(singleMatcher);
		}

		return input;
	}
}

function customDecodeURIComponent(input) {
	// Keep track of all the replacements and prefill the map with the `BOM`
	var replaceMap = {
		'%FE%FF': '\uFFFD\uFFFD',
		'%FF%FE': '\uFFFD\uFFFD'
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
	replaceMap['%C2'] = '\uFFFD';

	var entries = Object.keys(replaceMap);

	for (var i = 0; i < entries.length; i++) {
		// Replace all decoded components
		var key = entries[i];
		input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
	}

	return input;
}

function int2ip (ipInt) {
  return ( (ipInt>>>24) +'.' + (ipInt>>16 & 255) +'.' + (ipInt>>8 & 255) +'.' + (ipInt & 255) );
}

function escapeCharacter(code) {
    const chr = String.fromCharCode(code);
    if (code < 16)
      return '%0' + code.toString(16);
    else if ((code <= 32 || code > 127 || chr === '%' || chr === '#') && code < 256)
      return '%' + code.toString(16);
    else if (code >= 256) {
      return escapeCharacter(code >> 8) + escapeCharacter(code % 256);
    }
    return chr;
}

function webriskURIEscape(c) {
  return c.replace(/./g, (chr) => escapeCharacter(chr.charCodeAt(0)))
}

URI.SCHEMES.webrisk = {
  scheme: 'webrisk',
  domainHost: false,
  serialize(components, options) {
    URI.SCHEMES.http.serialize(components, options);
  },
  parse(components, options) {
    URI.SCHEMES.http.parse(components, options);
  },
  normalizeComponentEncoding(components) {
    for (const param of ['host', 'path']) {
      let prevParam;
      for (let infiniteLoopPreventor = 0; infiniteLoopPreventor < 1000; infiniteLoopPreventor ++) {
        prevParam = components[param];
        components[param] = customDecodeURIComponent(prevParam).replace(/[\t\x0a\x0d]/g, '');
        if (components[param] === prevParam) {
          break;
        }
      }
    }
    components.path = webriskURIEscape(components.path);
    components.host = webriskURIEscape(components.host.toLowerCase());
  },
  unicodeSupport: false,
};


exports.canonicalize = function(url) {
  const urlObj = URI.parse(
    url.trim().match(/^\w+:\/\//) ? url.trim() : `http://${url.trim()}`,
    { scheme: 'webrisk' }
  );
  urlObj.host = urlObj.host.replace(/\.+$/, "");
  if (urlObj.host.match(/^\d+$/)) {
    urlObj.host = int2ip(urlObj.host);
  }
  urlObj.port = "";
  let prevPath;
  for (let infiniteLoopPreventor = 0; infiniteLoopPreventor < 1000; infiniteLoopPreventor ++) {
    prevPath = urlObj.path;
    urlObj.path = customDecodeURIComponent(prevPath).replace(/[\t\x0a\x0d]/g, '');
    if (urlObj.path === prevPath) {
      break;
    }
  }
  //urlObj.path = urlObj.path.replace(/^$/, '/').replace(/\/\//g, '/');
  urlObj.path = webriskURIEscape(urlObj.path);
  urlObj.path = urlObj.path.replace(/\/\//g, '/');
  delete urlObj.fragment;
  //urlObj.host = customDecodeURIComponent(customDecodeURIComponent(punycode.toUnicode(urlObj.host)));
  return URI.serialize(urlObj, { unicodeSupport: true, scheme: 'webrisk' });
};
