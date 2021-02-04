function PacketServer(opcode) {
    this.opcode = opcode;
    return this;
}

PacketServer.OPCODE = {
    GW: 0x01,
    CHECK: 0x02,
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

