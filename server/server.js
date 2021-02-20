const net = require('net');
const methods = require('./chooseMethods');
const constServer = require('./constServer');
const BLOCK_SIZE = 1024;

const server = net.createServer((c) => {



    console.log(constServer.CONNECT);
    c.on('end', () => {
        methods.workWithFile({type: 8}, ip).then((resolve, reject) => {
        });
        console.log(constServer.DISCONNECT);
    });
    //getWallets

    let ip = Math.random().toString().slice(2, 11);
    console.log("c = ", c.localAddress);

    let allBuffer = '';
    c.on('data', data => {
        allBuffer += data;
        if (data.length < BLOCK_SIZE) {
            methods.workWithFile(JSON.parse(allBuffer.toString()), ip).then((resolve, reject) => {
                let buf = Buffer.from(JSON.stringify(resolve));
                const blocks = Math.floor(buf.length / BLOCK_SIZE | 0) + 1;
                for (let i = 0; i < blocks; i++) {
                    let start = i * BLOCK_SIZE;
                    let end = Math.min(start + BLOCK_SIZE, buf.length);
                    c.write(buf.slice(start, end));
                }
            });
            allBuffer = '';
        }
    });
});

server.on('error', (err) => {
    throw err;
});

server.listen(constServer.PORT, () => {
    console.log(constServer.BOUND);
});

