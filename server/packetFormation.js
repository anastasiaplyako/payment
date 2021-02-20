const packet = require("./packetServer");
const methods = require("./methods");
const constServer = require('./constServer');

const createPacketLogout = (ip) => {
    const logoutInfo = methods.logout(ip);
    return logoutInfo.isLogout
        ? packet.createOk()
        : packet.createError(logoutInfo.msgError);
}

const createPacketLogin = (dataFromFile, dataUserMsg, ip) => {
    let authInfo = methods.auth(dataFromFile, dataUserMsg, ip);
    return authInfo.isAuth && !authInfo.msgError
        ? packet.createOk()
        : packet.createError(authInfo.msgError);
}

const createPacketCheckWallet = async (dataFromFile, ip) => {
    const walletInfo = await methods.checkWallet(dataFromFile, ip);
    return walletInfo.amountWallet !== undefined
        ? packet.createCheckWallet(walletInfo.amountWallet)
        : packet.createError(walletInfo.msgError);
}

const createPacketGetWallets = (dataFromFile) => {
    const allWalletsId = methods.getWallets(dataFromFile);
    return (allWalletsId)
        ? packet.createGetWallets(allWalletsId)
        : packet.createError(constServer.NO_WALLETS)
}

const createPacketRegister = async (dataFromFile, dataUserMsg, ip) => {
    let resultOperation = await methods.register(dataFromFile, dataUserMsg, ip);
    return resultOperation.resultRegister && !resultOperation.msgError
        ? packet.createOk()
        : packet.createError(resultOperation.msgError)
}

const createPacketPut = async (dataFromFile, dataUserMsg, ip) => {
    let resultOperation = await methods.put(dataFromFile, dataUserMsg, ip);
    return resultOperation.isPut && !resultOperation.msgError
        ? packet.createOk()
        : packet.createError(resultOperation.msgError)
}

const createPacketTakeOff = async (dataFromFile, dataUserMsg, ip) => {
    let resultOperation = await methods.takeOff(dataFromFile, dataUserMsg, ip);
    return resultOperation.isTakeOff && !resultOperation.msgError
        ? packet.createOk()
        : packet.createError(resultOperation.msgError)
}

const createPacketTransfer = async (dataFromFile, dataUserMsg, ip) => {
    let resultOperation = await methods.transfer(dataFromFile, dataUserMsg, ip);
    return resultOperation.isTransfer && !resultOperation.msgError
        ? packet.createOk()
        : packet.createError(resultOperation.msgError)
}


const createPacketOk = async () => {
    return packet.createOk();
}

const createPacketBigMsg = async () => {
    return packet.createBigMsg();
}

module.exports = {
    createPacketLogout,
    createPacketLogin,
    createPacketCheckWallet,
    createPacketGetWallets,
    createPacketRegister,
    createPacketPut,
    createPacketTakeOff,
    createPacketTransfer,
    createPacketOk,
    createPacketBigMsg
}