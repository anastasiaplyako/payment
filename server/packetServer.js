/*

function PacketServer(opcode) {
    this.opcode = opcode;
    return this;
}

PacketServer.OPCODE = {
    REG: 0x01,

    /!*RRQ: 0x01,
    WRQ: 0x02,
    DATA: 0x03,
    ACK: 0x04,
    ERROR: 0x05*!/
};

PacketServer.createReader = (data, offset = 0) => {
    return {
        read(n) {
            const v = data.readUIntBE(offset, n);
            offset += n;
            return v;
        },
        readStr() {
            var start = offset;
            while (data[offset++]) { }
            return data.toString('ascii', start, offset - 1);
        },
        readToEnd() {
            return data.slice(offset);
        }
    }
};


PacketServer.createWriter = () => {
    return () => {

    };
};

PacketServer.parse = msg => {
    const packet = new PacketServer();
    const reader = PacketServer.createReader(msg);
    packet.opcode = reader.read(2);
    switch (packet.opcode) {
        case PacketServer.OPCODE.REG:
            packet.block = reader.read(2);
            packet.data = reader.readToEnd();
        case PacketServer.OPCODE.RRQ:
        case PacketServer.OPCODE.WRQ:
            packet.filename = reader.readStr();
            packet.mode = reader.readStr();
            break;
        case PacketServer.OPCODE.DATA:
            packet.block = reader.read(2);
            packet.data = reader.readToEnd();
            break;
        case PacketServer.OPCODE.ACK:
            packet.block = reader.read(2);
            break;
        case PacketServer.OPCODE.ERROR:
            packet.code = reader.read(2);
            packet.message = reader.readStr();
            break;
        default:
            break;
    }
    return packet;
};


PacketServer.encode = packet => {
    switch (packet.opcode) {
        case PacketServer.OPCODE.REG:
            const { block, data } = packet;
            return PacketServer.createRegister(block, data);
        case PacketServer.OPCODE.RRQ:
        case PacketServer.OPCODE.WRQ: {
            const { opcode, filename, mode } = packet;
            return PacketServer.createRequest(opcode, filename, mode);
        }
        case PacketServer.OPCODE.DATA: {
            const { block, data } = packet;
            return PacketServer.createData(block, data);
        }
        case PacketServer.OPCODE.ACK: {
            return PacketServer.createAck(packet.block);
        }
        case PacketServer.OPCODE.ERROR: {
            const { code, message } = packet;
            return PacketServer.createError(code, message);
        }
    }
};

PacketServer.prototype.toBuffer = function () {
    return PacketServer.encode(this);
};

/!*
   2 bytes     string    1 byte     string   1 byte
   ------------------------------------------------
  | Opcode |  Filename  |   0  |    Mode    |   0  |
   ------------------------------------------------

 *!/

PacketServer.createRegister = (blockNumber, data) => {
    const type = PacketServer.OPCODE.REG;
    const dataLen = Math.min(data.length, 512);
    const buffLen = 4 + dataLen;
    const buff = Buffer.alloc(buffLen);
    buff.writeUInt16BE(type, 0);
    buff.writeUInt16BE(blockNumber, 2);
    data.copy(buff, 4, 0, dataLen); // targetBuffer, targetStart, sourceStart, sourceEnd
    return buff;
}

PacketServer.createData = (blockNumber, data) => {
    const type = PacketServer.OPCODE.DATA;
    const dataLen = Math.min(data.length, 512);
    const buffLen = 4 + dataLen;
    const buff = Buffer.alloc(buffLen);
    buff.writeUInt16BE(type, 0);
    buff.writeUInt16BE(blockNumber, 2);
    data.copy(buff, 4, 0, dataLen); // targetBuffer, targetStart, sourceStart, sourceEnd
    return buff;
}

PacketServer.createRequest = (type, filename, mode = 'octet') => {
    const buffLen = 4 + filename.length + mode.length;
    const buff = Buffer.alloc(buffLen);
    buff.writeUInt16BE(type, 0);
    buff.write(filename, 2, 'ascii');
    buff.write(mode, 2 + filename.length + 1, 'ascii');
    buff[2 + filename.length] = buff[buffLen - 1] = 0;
    return buff;
}

/!*

           2 bytes     2 bytes      n bytes
           ----------------------------------
          | Opcode |   Block #  |   Data     |

 *!/
PacketServer.createData = (blockNumber, data) => {
    const type = PacketServer.OPCODE.DATA;
    const dataLen = Math.min(data.length, 512);
    const buffLen = 4 + dataLen;
    const buff = Buffer.alloc(buffLen);
    buff.writeUInt16BE(type, 0);
    buff.writeUInt16BE(blockNumber, 2);
    data.copy(buff, 4, 0, dataLen); // targetBuffer, targetStart, sourceStart, sourceEnd
    return buff;
}

/!*
                        Creates a buffer for a ACK packet
                         2 bytes     2 bytes
                         ---------------------
                        | Opcode |   Block #  |
                         ---------------------
 *!/
PacketServer.createAck = blockNumber => {
    const type = PacketServer.OPCODE.ACK;
    const buff = Buffer.alloc(4);
    buff.writeUInt16BE(type, 0);
    buff.writeUInt16BE(blockNumber, 2);
    return buff;
}

/!*
*
*
*                2 bytes     2 bytes      string    1 byte
               -----------------------------------------
              | Opcode |  ErrorCode |   ErrMsg   |   0  |
               -----------------------------------------


* *!/
PacketServer.createError = (code, message) => {
    const type = PacketServer.OPCODE.ERROR;
    const buff = Buffer.alloc(4);
    buff.writeUInt16BE(type, 0);
    buff.writeUInt16BE(code, 2);
    buff.writeUInt16BE(message, 2);
    return buff;
}

module.exports = PacketServer;*/

function PacketServer(opcode) {
    this.opcode = opcode;
    return this;
}

PacketServer.OPCODE = {
    REG: 0x00, //now not use
    GW: 0x01,
    WRQ: 0x02,
    LOGIN: 0x03,
    ACK: 0x04,
    ERROR: 0x05,
    OK: 0x06,
};

PacketServer.createGetWallets = (ids) => {
    return {
        type: PacketServer.OPCODE.GW,
        ids: ids
    }
};

PacketServer.createOk = () => {
    return {
        type: PacketServer.OPCODE.OK,
    }
};

PacketServer.createError = (msg) => {
    return {
        type: PacketServer.OPCODE.ERROR,
        msg: msg,
    }
};


module.exports = PacketServer;

