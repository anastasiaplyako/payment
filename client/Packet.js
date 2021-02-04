//создание пакетов

function Packet(opcode) {
    this.opcode = opcode;
    return this;
}

Packet.OPCODE = {
    REG: 0x00,
    GETWAL: 0x01,
    CHECK: 0x02,
    LOGIN: 0x03,
    LOGOUT: 0x04,
    PUT: 0x05,
    TAKE_OFF: 0x06,
    TRANSFER: 0x07,
};

Packet.createRegister = (login, password) => {
    return {
        type: Packet.OPCODE.REG,
        login: login,
        password: password,
    }
}

Packet.createGetWallets = () => {
    return {
        type: Packet.OPCODE.GETWAL,
    }
}

Packet.createLogIn = (login, password) => {
    return {
        type: Packet.OPCODE.LOGIN,
        login: login,
        password: password,
    }
}

Packet.createLogout = () => {
    return {
        type: Packet.OPCODE.LOGOUT,
    }
}

Packet.createCheckWallet = () => {
    return {
        type: Packet.OPCODE.CHECK,
    }
}

Packet.createPut = (amount) => {
    return {
        type: Packet.OPCODE.PUT,
        amount
    }
}

Packet.createTakeOff = (amount) => {
    return {
        type: Packet.OPCODE.TAKE_OFF,
        amount
    }
}

Packet.createTransfer = (amount, billingWalletId) => {
    return {
        type: Packet.OPCODE.TRANSFER,
        amount,
        billingWalletId
    }
}


module.exports = Packet;