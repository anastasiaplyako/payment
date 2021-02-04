const net = require('net');
const methodsPacket = require("./packetFormationClient");
const methodReply = require("./replyServer");
const constClient = require("./constClient");
var readline = require('readline'),
    rl = readline.createInterface(process.stdin, process.stdout);

const client = net.createConnection({host: constClient.host, port: constClient.PORT}, () => {
    console.log(constClient.CONNECT);
});

rl.on('line', (input) => {
    let inputData = input.split(" ");
    let [methods, ...params] = inputData;
    switch (methods) {
        case 'register': {
            client.write(methodsPacket.packetRegister(params[0], params[1]));
            break;
        }
        case 'getWallets': {
            client.write(methodsPacket.packetGetAllWallets());
            break;
        }
        case 'logIn': {
            client.write(methodsPacket.packetLogIn(params[0], params[1]));
            break;
        }
        case 'logout': {
            client.write(methodsPacket.packetLogout());
            break;
        }
        case 'check': {
            client.write(methodsPacket.packetCheckWallet());
            break;
        }
        case 'put': {
            client.write(methodsPacket.packetPut(+params[0]));
            break;
        }
        case 'takeOff': {
            client.write(methodsPacket.packetTakeOff(+params[0]));
            break;
        }
        case 'transfer': {
            client.write(methodsPacket.packetTransfer(+params[0], params[1]));
            break;
        }
        default: {
            console.log(constClient.ERROR)
        }
    }
});

client.on('data', (data) => {
    let replyPacketServer = JSON.parse(data.toString());
    methodReply.reply(replyPacketServer);
});

client.on('end', () => {
    console.log(constClient.DISCONNECT);
    rl.close();
    client.end();
});
