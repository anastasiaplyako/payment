const fs = require('fs');
const constServer = require('./constServer');
let authUser = [];

const checkWallet = async (dataFromFile, ip) => {
    let amountWallet;
    let msgError;
    const walletId = findAuthWallet(ip);
    if (walletId) {
        if (checkNumberDevices(walletId) > 1) {
            await sleep(getRandomInt(100));
        }
        let userFind = dataFromFile["users"].find(user => user.walletId === walletId);
        amountWallet = userFind.amount
    } else {
        msgError = constServer.NO_WALLETS + " or " + constServer.NOT_LOGIN;
    }
    return {amountWallet, msgError}
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
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
            msgError = constServer.NOT_AUTH
        }
    } else {
        msgError = constServer.LOGOUT
    }
    return {isAuth, msgError};
}

const checkNumberDevices = (walletId) => {
    let numberDevices = 0;
    authUser.map(user => {
       if (user.walletId === walletId) {
           numberDevices++;
       }
    })
    return numberDevices;
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
        let indexLogout = authUser.findIndex((user) => user.ip === ip);
        authUser.splice(indexLogout, 1);
        isLogout = true;
    } else {
        msgError = constServer.NOT_LOGIN;
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
    await fs.writeFile(
        constServer.FILE_STORAGE_USERS,
        JSON.stringify(updateObjectJSON),
        function writeJSON(err) {
            if (err) return console.log(err);
        });
};

const checkExistLoginPassword = (dataFromFile, login, password) => {
    return dataFromFile["users"].find(
        user => user.login === login || user.password === password
    )
}

const put = async (dataFromFile, dataUserMsg, ip) => {
    let msgError;
    let walletId = findAuthWallet(ip);
    if (checkNumberDevices(walletId) > 1) {
        await sleep(getRandomInt(100));
    }
    let resultPut = changeAmount(dataFromFile, walletId, dataUserMsg.amount, ip);
    let isPut = resultPut.isDoneOperation;
    if (isPut) {
        await updateFile(dataFromFile);
    } else {
        msgError = resultPut.msgError
    }
    return {
        isPut,
        msgError
    }
}

const register = async (dataFromFile, dataUserMsg, ip) => {
    const login = dataUserMsg.login;
    const password = dataUserMsg.password;
    let resultRegister = false;
    let msgError;
    if (checkAuth(ip)) {
        return {
            resultRegister,
            msgError: constServer.LOGOUT
        }
    }
    if (checkExistLoginPassword(dataFromFile, login, password)) {
        return {
            resultRegister,
            msgError: constServer.EXIST_PSW_LOG
        }
    }
    dataFromFile["users"].push({
        login: login,
        password: password,
        amount: 0,
        walletId: generateOnlineWallet(dataFromFile)
    });
    await updateFile(dataFromFile);
    resultRegister = true;
    auth(dataFromFile, dataUserMsg, ip)
    return {
        resultRegister,
        msgError
    }
};

const getWallets = (dataFromFile) => {
    let allWalletsId = [];
    dataFromFile["users"].map((user) => {
        allWalletsId.push(user.walletId);
    });
    return allWalletsId;
}

const generateOnlineWallet = (dataFromFile) => {
    let isNewWallet = false;
    let walletId;
    while (!isNewWallet) {
        walletId = Math.random().toString().slice(2, 11);
        if (!dataFromFile["users"].find(user => user.walletId === walletId)) {
            isNewWallet = true;
        }
    }
    return walletId;
}

const findUserByWallet = (dataFromFile, walletId) => {
    return dataFromFile["users"].find(user => user.walletId === walletId);
}

//TODO - optimize and delete 3 if
const changeAmount = (dataFromFile, walletId, amount, ip) => {
    let isDoneOperation = false;
    let msgError;
    if (checkAuth(ip)) {
        dataFromFile["users"].map((user) => {
            if (user.walletId === walletId) {
                user.amount = +user.amount + +amount;
                if (user.amount < 0) {
                    msgError = constServer.NOT_ENOUGH_MONEY
                } else {
                    isDoneOperation = true;
                }

            }
        });
    } else {
        msgError = constServer.NOT_LOGIN;
    }
    return {
        isDoneOperation,
        msgError
    };
}

const takeOff = async (dataFromFile, dataUserMsg, ip) => {
    let msgError;
    let walletId = findAuthWallet(ip);
    if (checkNumberDevices(walletId) > 1) {
        await sleep(getRandomInt(100));
    }
    let resultTakeOff = changeAmount(dataFromFile, walletId, -dataUserMsg.amount, ip);
    let isTakeOff = resultTakeOff.isDoneOperation;
    if (isTakeOff) {
        await updateFile(dataFromFile);
    } else {
        msgError = resultTakeOff.msgError
    }
    return {
        isTakeOff,
        msgError
    }
}

const transfer = async (dataFromFile, dataUserMsg, ip) => {
    let isTransfer = false;
    let msgError;
    const isExistBillingWallet = findUserByWallet(dataFromFile, dataUserMsg.billingWalletId);
    if (!isExistBillingWallet) {
        return {
            isTransfer: isTransfer,
            msgError: constServer.NOT_BILLING_WALLET
        }
    }
    let walletId = findAuthWallet(ip);
    if (checkNumberDevices(walletId) > 1) {
        await sleep(getRandomInt(100));
    }
    let resultTakeOff = changeAmount(dataFromFile, walletId, -dataUserMsg.amount, ip);
    if (resultTakeOff.isDoneOperation) {
        let resultPut = changeAmount(dataFromFile, dataUserMsg.billingWalletId, dataUserMsg.amount, ip);
        if (resultPut.isDoneOperation) {
            await updateFile(dataFromFile);
            isTransfer = true;
        } else {
            msgError = resultPut.msgError;
        }
    } else {
        msgError = resultTakeOff.msgError;
    }
    return {
        isTransfer: isTransfer,
        msgError
    }
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
    generateOnlineWallet,
    put,
    takeOff,
    transfer
}