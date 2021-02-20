const net = require('net');
const methodsPacket = require("./packetFormationClient");
const methodReply = require("./replyServer");
const constClient = require("./constClient");
var readline = require('readline'),
    rl = readline.createInterface(process.stdin, process.stdout);
//'5.187.5.237'
const client = net.createConnection({host: constClient.HOST, port: 8124}, () => {

    console.log(constClient.CONNECT);
});

const splitBlock = (client, packet ) => {
    const blocks = Math.floor(packet.length / constClient.BLOCK_SIZE | 0) + 1;
    for (let i = 0; i < blocks; i++) {
        let start = i * constClient.BLOCK_SIZE;
        let end = Math.min(start + constClient.BLOCK_SIZE, packet.length);
        client.write(packet.slice(start, end));
    }
}

rl.on('line', (input) => {
    let inputData = input.split(" ");
    let [methods, ...params] = inputData;
    switch (methods) {
        case 'register': {
            splitBlock(client, methodsPacket.packetRegister(params[0], params[1]))
            break;
        }
        case 'getWallets': {
            splitBlock(client, methodsPacket.packetGetAllWallets());
            break;
        }
        case 'logIn': {
            splitBlock(client, methodsPacket.packetLogIn(params[0], params[1]));
            break;
        }
        case 'logout': {
            splitBlock(client, methodsPacket.packetLogout());
            break;
        }
        case 'check': {
            splitBlock(client, methodsPacket.packetCheckWallet());
            break;
        }
        case 'put': {
            splitBlock(client, methodsPacket.packetPut(+params[0]));
            break;
        }
        case 'takeOff': {
            splitBlock(client, methodsPacket.packetTakeOff(+params[0]));
            break;
        }
        case 'transfer': {
            splitBlock(client, methodsPacket.packetTransfer(+params[0], params[1]));
            break;
        }
        case 'bigMsg': {
            splitBlock(client, methodsPacket.packetBigMsg());
            break;
        }
        case 'bigMsgServer': {
            splitBlock(client, methodsPacket.packetBigMsgServer());
            break;
        }
        default: {
            console.log(constClient.ERROR)
        }
    }
});

let body = '';
client.on('data', (chunk) => {
    body += chunk;
    if (chunk.length < constClient.BLOCK_SIZE) {
        let replyPacketServer = JSON.parse(body.toString());
        methodReply.reply(replyPacketServer);
        body = '';
    }

});

client.on('end', () => {
    console.log(constClient.DISCONNECT);
    rl.close();
    client.end();
});
