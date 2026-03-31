#!/usr/bin/env node
import { getPrefixMap } from "webrisk-hash";
const res = getPrefixMap(process.argv[2]);
console.log(res.map(l => `${l[0]} ${l[1].toString("hex")}`).join('\n'));
