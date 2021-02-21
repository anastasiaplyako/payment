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

rl.on('line', (input) => {
    let inputData = input.split(" ");
    let [methods, ...params] = inputData;
    switch (methods) {
        case 'register': {
            client.write(methodsPacket.packetRegister(params[0], params[1]))
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
        case 'bigMsg': {
            client.write(methodsPacket.packetBigMsg());
            break;
        }
        case 'bigMsgServer': {
            client.write(methodsPacket.packetBigMsgServer());
            break;
        }
        default: {
            console.log(constClient.ERROR)
        }
    }
});

let body = [];
client.on('data', (chunk) => {
    /*console.log("last = ", chunk.toString(), '\n');*/

    if (chunk[chunk.length - 1] === 3) {
        chunk = chunk.slice(0, chunk.length - 1);
        body.push(chunk);
        let replyPacketServer = JSON.parse(Buffer.concat(body).toString('utf8'));
        methodReply.reply(replyPacketServer);
        body = [];
    } else {
        body.push(chunk);
    }
});

client.on('end', () => {
    console.log(constClient.DISCONNECT);
    rl.close();
    client.end();
});
