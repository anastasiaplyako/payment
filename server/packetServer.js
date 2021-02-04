function PacketServer(opcode) {
    this.opcode = opcode;
    return this;
}

PacketServer.OPCODE = {
    REG: 0x00, //now not use
    GW: 0x01,
    CHECK: 0x02,
    LOGIN: 0x03,  //now not use
    ACK: 0x04,  //now not use
    ERROR: 0x05,
    OK: 0x06
};

PacketServer.createGetWallets = (ids) => {
    return {
        type: PacketServer.OPCODE.GW,
        ids: ids
    }
};

PacketServer.createCheckWallet = (amount) => {
    return {
        type: PacketServer.OPCODE.CHECK,
        amount
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

