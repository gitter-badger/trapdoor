var assert = require("chai").assert;
var Util = require("../src/util.js");
var BufferReader = require("buffer-reader");

describe("util", function() {
    describe("#varintFromBufferReader", function() {
        it("should correctly convert a BufferReader to a varint", function() {
            assert.equal(300, Util.varintFromBufferReader(new BufferReader(Buffer.from([0xAC,0x02]))));
            assert.equal(1, Util.varintFromBufferReader(new BufferReader(Buffer.from([0x01]))));
        });
    });
});