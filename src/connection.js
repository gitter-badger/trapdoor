var net = require('net');
var log4js = require('log4js');
var varint = require('varint');
var BufferReader = require('buffer-reader');
var Packets = require("./packets");
var Util = require("./util.js")

class Connection
{
    constructor(stream)
    {
        this.connectionState = Connection.connectionState.HANDSHAKING;
        this.netStream = stream;
        this.logger = log4js.getLogger();
    }

    handlePacket(buff, status)
    {
        var reader = new BufferReader(buff);

        // Get packet length...
        var length = Util.varintFromBufferReader(reader);
        // Get packet ID...
        var pId = Util.varintFromBufferReader(reader);
        if(pId == 122)
        {
            this.logger.error("Malformed JSON request? Client has requested legacy ping...");
        }
        else
        {
            this.logger.info("Packet ID: " + pId);
            this.logger.info("Buffer Length: " + buff.length);
            this.logger.info("Buffer Contents: " + buff.inspect());
        }

        this.logger.info("Current Connection State: " + this.connectionState);

        switch(this.connectionState)
        {
            case Connection.connectionState.HANDSHAKING:
            {
                switch(pId)
                {
                    case 0x00:
                        var version = Util.varintFromBufferReader(reader);
                        var addressSize = Util.varintFromBufferReader(reader);
                        var address = reader.nextString(addressSize);
                        var port = reader.nextUInt16BE();
                        var nextState = Util.varintFromBufferReader(reader);
                        this.logger.info("Version: " + version);
                        this.logger.info("Address: " + address);
                        this.logger.info("Port: " + port);
                        this.connectionState = nextState;
                        if(reader.tell() < buff.length) this.handlePacket(buff.slice(reader.tell()), status);
                        break;
                }
                break;
            }
            case Connection.connectionState.STATUS:
            {
                switch(pId)
                {
                    case 0x00:
                        var resp = new Packets.PacketStatusResponse(status);
                        this.logger.info(resp.toString());
                        var strLengthBuffer = Buffer.from(varint.encode(resp.toString().length));
                        var npLength = resp.toString().length + 1 + strLengthBuffer.length;
                        var lengthBuffer = Buffer.from(varint.encode(npLength));
                        var codeBuffer = Buffer.from([0x00]);
                        var stringBuffer = Buffer.from(resp.toString());
                        var finalBuffer = Buffer.concat([lengthBuffer,codeBuffer,strLengthBuffer,stringBuffer]);
                        this.netStream.write(finalBuffer);
                        this.logger.info(finalBuffer.inspect());
                    break;
                    case 0x01:
                        this.netStream.write(buff);
                    break;
                }
                break;
            }
            default:
            {
                this.logger.fatal("Invalid connection state " + this.connectionState + " - closing...");
                this.close();
            }
        }
    }

    close()
    {
    }

}

Connection.connectionState = {
    HANDSHAKING : 0,
    STATUS: 1,
    LOGIN: 2,
    PLAY: 3,
}


module.exports = Connection;