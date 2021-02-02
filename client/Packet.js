
function Packet(opcode) {
    this.opcode = opcode;
    return this;
}


Packet.OPCODE = {
    REG: 0x00,
    GW: 0x01,
    LOGIN: 0x03,
    ACK: 0x04,
    ERROR: 0x05,
    OK: 0x06
};

//REG
Packet.createRegister = (login, password) => {
    return {
        type: Packet.OPCODE.REG,
        login: login,
        password: password,
    }
}

//GAWI
Packet.createGetWallets = () => {
    return {
        type: Packet.OPCODE.GW,
    }
}

//LI
Packet.createLogIn = (login, password) => {
    return {
        type: Packet.OPCODE.LOGIN,
        login: login,
        password: password,
    }
}






module.exports = Packet;