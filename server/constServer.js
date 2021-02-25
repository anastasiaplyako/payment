const FILE_STORAGE_USERS = './storage/users.json';
const FILE_STORAGE_WALLETS = './storage/stateWallets.json';
const PORT = 8124;
const BOUND = 'server bound';
const CONNECT = 'client connected';
const DISCONNECT = 'client disconnected';
const ERROR_TYPE = "error with type";
const NO_WALLETS = "no wallets created yet";
const NOT_ENOUGH_MONEY = "Not enough money in wallet";
const NOT_LOGIN = "You are not login in system";
const NOT_BILLING_WALLET = "This billing wallet isn`t exist";
const EXIST_PSW_LOG = "such username or password already exists";
const LOGOUT = "You are login in system. Please logout";
const NOT_AUTH = "Not authenticated! Try again";
const LAST_INDEX_NUMBER = 3;

module.exports = {
    FILE_STORAGE_USERS,
    FILE_STORAGE_WALLETS,
    PORT,
    BOUND,
    CONNECT,
    DISCONNECT,
    ERROR_TYPE,
    NO_WALLETS,
    NOT_ENOUGH_MONEY,
    NOT_LOGIN,
    NOT_BILLING_WALLET,
    EXIST_PSW_LOG,
    LOGOUT,
    NOT_AUTH,
    LAST_INDEX_NUMBER
}
