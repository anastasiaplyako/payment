const tftp = require('..');
var fs = require('fs');
const Packet = require('./Packet');
const net = require('net');
const client = net.createConnection({port: 8124}, () => {
    // 'connect' listener.
    console.log();
    console.log('connected to server!');
    //client.write('world!\r\n');
});

var readline = require('readline'),
    rl = readline.createInterface(process.stdin, process.stdout);


rl.on('line', (input) => {
    console.log(`Received: ${input}`);
    let inputData = input.split(" ");
    let [methods, ...params] = inputData;
    switch (methods) {
        case 'register': {
            client.write(packetRegister(params[0]));
            break;
        }
        case 'getWallets': {
            client.write(packetGetAllWallets());
            break;
        }
        case 'logIn': { //logIn login password
            client.write(packetLogIn(params[0], params[1]));
            break;
        }
        default: {
            console.log("Error! Try it again")
        }
    }
});

const packetRegister = (login) => {
    return Buffer.from(JSON.stringify(Packet.createRegister(login)))
}

const packetGetAllWallets = () => {
    return Buffer.from(JSON.stringify(Packet.createGetWallets()))
}

const packetLogIn = (login, password) => {
    return Buffer.from(JSON.stringify(Packet.createLogIn(login, password)))
}
//принимаешь запросы от сервера
/*
1 - сервер отправляет все id кошельков (полю ids json объекта). Приходящее сообщение имеет вид: {}
5 - О ноу! Это ошибка. чтобы увидеть сообщение об ошибке, обратись к полю msg json объекта
6 - все хорошо
 */
client.on('data', (data) => {
    let replyPacketServer = JSON.parse(data.toString());
    console.log("reply from server ", replyPacketServer.type);
    switch (replyPacketServer.type) {
        case (1): {
            console.log("all wallets = ", replyPacketServer.ids.toString());
            break;
        }
        case (5): {
            console.log("Sorry, its error. ", replyPacketServer.msg);
            break;
        }
        case (6): {
            console.log("OK! ");
            break;
        }
        default: {

        }

    }
    /*client.end();*/
});

client.on('end', () => {
    console.log('disconnected from server');
});


/*
const readChunk = filename =>
    new Promise(async (resolve, reject) => {
        const buffer = [];
        await read(filename, chunk => buffer.push(chunk), () =>
            resolve(Buffer.concat(buffer)));
    });
*/
