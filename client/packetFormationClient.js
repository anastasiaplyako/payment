//формирование пакета
const Packet = require('./Packet');

const packetRegister = (login, password) => {
    return Buffer.from(JSON.stringify(Packet.createRegister(login, password)))
}

const packetGetAllWallets = () => {
    return Buffer.from(JSON.stringify(Packet.createGetWallets()))
}

const packetLogIn = (login, password) => {
    return Buffer.from(JSON.stringify(Packet.createLogIn(login, password)))
}

const packetLogout = () => {
    return Buffer.from(JSON.stringify(Packet.createLogout()))
}

const packetCheckWallet = () => {
    return Buffer.from(JSON.stringify(Packet.createCheckWallet()))
}

const packetPut = (amount) => {
    return Buffer.from(JSON.stringify(Packet.createPut(amount)))
}

const packetTakeOff = (amount) => {
    return Buffer.from(JSON.stringify(Packet.createTakeOff(amount)))
}

const packetTransfer = (amount, billingWalletId) => {
    return Buffer.from(JSON.stringify(Packet.createTransfer(amount, billingWalletId)))
}

module.exports = {
    packetRegister,
    packetGetAllWallets,
    packetLogIn,
    packetLogout,
    packetCheckWallet,
    packetPut,
    packetTakeOff,
    packetTransfer,
}