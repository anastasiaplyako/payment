//формирование пакета
const Packet = require('./Packet');

const packetRegister = (login, password) => {
    return Buffer.from(JSON.stringify(Packet.createRegister(login, password))+ '\u0003')
}

const packetGetAllWallets = () => {
    return Buffer.from(JSON.stringify(Packet.createGetWallets())+ '\u0003')
}

const packetLogIn = (login, password) => {
    return Buffer.from(JSON.stringify(Packet.createLogIn(login, password))+ '\u0003')
}

const packetLogout = () => {
    return Buffer.from(JSON.stringify(Packet.createLogout())+ '\u0003')
}

const packetCheckWallet = () => {
    return Buffer.from(JSON.stringify(Packet.createCheckWallet())+ '\u0003')
}

const packetPut = (amount) => {
    return Buffer.from(JSON.stringify(Packet.createPut(amount))+ '\u0003')
}

const packetTakeOff = (amount) => {
    return Buffer.from(JSON.stringify(Packet.createTakeOff(amount))+ '\u0003')
}

const packetTransfer = (amount, billingWalletId) => {
    return Buffer.from(JSON.stringify(Packet.createTransfer(amount, billingWalletId))+ '\u0003')
}

const packetBigMsg = () => {
    return Buffer.from(JSON.stringify(Packet.createBigMsg())+ '\u0003', 'utf8')
}

const packetBigMsgServer = () => {
    return Buffer.from(JSON.stringify(Packet.createBigMsgServer())+ '\u0003', 'utf8')
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
    packetBigMsg,
    packetBigMsgServer
}