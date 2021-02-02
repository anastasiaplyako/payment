var fs = require('fs');
const constFile = require('./constInfo');
const packet = require("./packetServer");
let authUser = [];

module.exports.workWithFile = async (dataUserMsg, ip) => {
    let resPak;
    const data = fs.readFileSync(constFile.FILE_STORAGE_USERS, 'utf8');
    let dataFromFile = JSON.parse(data);
    switch (dataUserMsg.type) {
        case(0): {
            resPak = await registerToFile(dataFromFile, dataUserMsg);
            console.log("resPak", resPak);
            break;
        }
        case(1): {
            resPak = getWallets(dataFromFile);
            console.log("resPak1", resPak);
            break;
        }
        case(3): {
            resPak = auth(dataFromFile, dataUserMsg, ip)
                ? packet.createOk()
                : packet.createError("Not authenticated! Try again");
            break;
        }
        default: {
            console.log("error with type")
        }
    }
    return resPak;

};

const auth = (dataFromFile, dataUserMsg, ip) => {
    let isAuth = checkAuth(ip);
    if (!checkAuth(ip)) {
        const login = dataUserMsg.login;
        const password = dataUserMsg.password;
        const walletId = checkLoginPassword(dataFromFile, login, password);
        if (walletId) {
            authUser.push({
                ip: ip,
                walletId: walletId
            });
            isAuth = true;
        }
    }
    return isAuth;
}

const checkAuth = (ip) => {
    let isAuth = false;
    authUser.map((user) => {
        if (user.ip === ip) {
            isAuth = true;
        }
    });
    return isAuth;
}


//TODO make more easy
const checkLoginPassword = (dataFromFile, login, password) => {
    let walletId = false;
    dataFromFile["users"].map((user) => {
        if (user.login === login && user.password === password) {
            walletId = user.walletId;
            return walletId;
        }
    });
    return walletId;
}

const updateFile = async (updateObjectJSON) => {
    await fs.writeFile(constFile.FILE_STORAGE_USERS, JSON.stringify(updateObjectJSON), function writeJSON(err) {
        if (err) return console.log(err);
    });
};

const registerToFile = async (dataFromFile, dataUserMsg) => {
    const login = dataUserMsg.login;
    const password = dataUserMsg.password;
    let isFirst = true;
    //TODO вынести в отдельную функцию
    dataFromFile["users"].map((user) => {
        if (user.login === login && user.password === password) {
            isFirst = false;
        }
    });
    if (isFirst) {
        dataFromFile["users"].push({
            login: login,
            count: 0,
            walletId: generateOnlineWallet()
        });
        await updateFile(dataFromFile)
    }
    return (isFirst) ? packet.createOk() : packet.createError("this user already exist")
};

const getWallets = (dataFromFile) => {
    let allWalletsId = [];
    dataFromFile["users"].map((user) => {
        allWalletsId.push(user.walletId);
    });
    return (allWalletsId)
        ? packet.createGetWallets(allWalletsId)
        : packet.createError("no wallets created yet")
}

const generateOnlineWallet = () => {
    return Math.random().toString().slice(2, 11);
}


