var fs = require('fs');
const constFile = require('./constServer');
const packetMethods = require("./packetFormation");
const constServer = require('./constServer');

module.exports.workWithFile = async (dataUserMsg, ip) => {
    let resPak;
    const data = fs.readFileSync(constFile.FILE_STORAGE_USERS, 'utf8');
    let dataFromFile = JSON.parse(data);
    console.log("dataUserMsg.type", dataUserMsg.type);
    switch (dataUserMsg.type) {
        case(0): {
            resPak = await packetMethods.createPacketRegister(dataFromFile, dataUserMsg, ip);
            break;
        }
        case(1): {
            resPak = packetMethods.createPacketGetWallets(dataFromFile);
            break;
        }
        case(2): {
            resPak = await packetMethods.createPacketCheckWallet(dataFromFile, ip);
            break;
        }
        case(3): {
            resPak = packetMethods.createPacketLogin(dataFromFile, dataUserMsg, ip);
            break;
        }
        case(4): {
            resPak = packetMethods.createPacketLogout(ip);
            break;
        }
        case(5): {
            resPak = packetMethods.createPacketPut(dataFromFile, dataUserMsg, ip);
            break;
        }
        case(6): {
            resPak = packetMethods.createPacketTakeOff(dataFromFile, dataUserMsg, ip);
            break;
        }
        case(7): {
            resPak = packetMethods.createPacketTransfer(dataFromFile, dataUserMsg, ip);
            break;
        }
        case(8): {
            resPak = packetMethods.createPacketOk();
            console.log(JSON.stringify(dataUserMsg.text).toString());
            //resPak = packetMethods.createPacketTransfer(dataFromFile, dataUserMsg, ip);
            break;
        }
        case(9): {
            resPak = packetMethods.createPacketBigMsg()
            break;
        }
        default: {
            console.log(constServer.ERROR_TYPE)
        }
    }
    return resPak;
};





