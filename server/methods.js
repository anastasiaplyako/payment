const fs = require('fs');
const constFile = require('./constInfo');
const packet = require("./packetServer");
let authUser = [];

const checkWallet = (dataFromFile, ip) => {
    let amountWallet = 0;
    let msgError;
    const walletId = findAuthWallet(ip);
    if (walletId) {
        let userFind = dataFromFile["users"].find(user => user.walletId === walletId);
        amountWallet = userFind.amount
    } else {
        msgError = "no such wallet exists"
    }
    return {amountWallet, msgError}
}

const auth = (dataFromFile, dataUserMsg, ip) => {
    let isAuth = checkAuth(ip);
    let msgError;
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
        } else {
            msgError = "Not authenticated! Try again";
        }
    } else {
        msgError = "You are already login, if you want choose another account, logout"
    }
    return {isAuth, msgError};
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

const findAuthWallet = (ip) => {
    let walletId;
    authUser.map((user) => {
        if (user.ip === ip) {
            walletId = user.walletId;
        }
    });
    return walletId;
}

const logout = (ip) => {
    let isLogout = false;
    let msgError;
    if (checkAuth(ip)) {
        let indexLogout = authUser.findIndex((user, index) => user.ip === ip);
        authUser.splice(indexLogout);
        isLogout = true;
        console.log("authUser =", authUser)
    } else {
        msgError = "you are not login in system";
    }
    return {
        isLogout, msgError
    }
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

const register = async (dataFromFile, dataUserMsg, ip) => {
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
            amount: 0,
            walletId: generateOnlineWallet()
        });
        await updateFile(dataFromFile)
    }
    const tmp = auth(dataFromFile, dataUserMsg, ip);
    console.log("tmp = ", tmp, authUser)
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

module.exports = {
    checkWallet: checkWallet,
    updateFile,
    auth,
    checkAuth,
    logout,
    findAuthWallet,
    checkLoginPassword,
    register,
    getWallets,
    generateOnlineWallet
}