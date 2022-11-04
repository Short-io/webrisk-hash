import assert from 'assert';
import test from "node:test";
import { truncatedSha256Prefix } from "../index.js";

test("len4", t => {
    // Example B1 from FIPS-180-2
    const input1 = "abc";
    const output1 = truncatedSha256Prefix(input1, 32);
    const expected1 = new Buffer([ 0xba, 0x78, 0x16, 0xbf ]);
    assert.equal(output1.length, 4);  // 4 bytes == 32 bits
    for (let i = 0; i < output1.length; i++)
        assert.equal(output1[i], expected1[i]);
});

test("len6", t => {
    // Example B2 from FIPS-180-2
    const input2 = "abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq";
    const output2 = truncatedSha256Prefix(input2, 48);
    const expected2 = new Buffer([0x24, 0x8d, 0x6a, 0x61, 0xd2, 0x06]);
    assert.equal(output2.length, 6);
    for (let i = 0; i < output2.length; i++)
        assert.equal(output2[i], expected2[i]);
});

test("len12", t => {
    // Example B3 from FIPS-180-2
    const input3 = Array(1000000).fill('a').join('');  // 'a' repeated a million times
    const output3 = truncatedSha256Prefix(input3, 96);
    const expected3 = new Buffer([0xcd, 0xc7, 0x6e, 0x5c, 0x99, 0x14, 0xfb, 0x92,
                        0x81, 0xa1, 0xc7, 0xe2]);
    assert.equal(output3.length, 12);
    for (let i = 0; i < output3.length; i++)
        assert.equal(output3[i], expected3[i]);
});
