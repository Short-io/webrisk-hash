#!/usr/bin/env node
const webrisk = require("webrisk-hash");
const res = webrisk.getPrefixMap(process.argv[2]);
console.log(res.map(l => `${l[0]} ${l[1].toString("hex")}`).join('\n'));
