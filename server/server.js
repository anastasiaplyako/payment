const net = require('net');
const methods = require('./chooseMethods');
const constServer = require('./constServer');
const server = net.createServer((c) => {

    console.log(constServer.CONNECT);
    c.on('end', () => {
        methods.workWithFile({type: 8}, ip).then((resolve, reject) => {
        });
        console.log(constServer.DISCONNECT);
    });

    let ip = Math.random().toString().slice(2, 11);
    console.log("c = ", c.localAddress);
    c.on('data', data => {
        methods.workWithFile(JSON.parse(data.toString()), ip).then((resolve, reject) => {
            c.write(Buffer.from(JSON.stringify(resolve)));
        });
    });
});

server.on('error', (err) => {
    throw err;
});

server.listen(constServer.PORT, () => {
    console.log(constServer.BOUND);
});

