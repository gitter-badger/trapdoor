var varint = require('varint');
var BufferReader = require('buffer-reader');

exports.varintFromBufferReader = function(reader)
{
    var tempBuff = Buffer.alloc(4, 0x00);
    for(var i = 0;i < 4;i++)
    {
        var b = reader.nextUInt8();
        tempBuff.writeUInt8(b, i);
        if((b & 128) != 128) break;
    }
    return varint.decode(tempBuff);
}