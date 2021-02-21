const net = require('net');
const methods = require('./chooseMethods');
const constServer = require('./constServer');
const BLOCK_SIZE = 1024;
const iconv = require('iconv-lite');

const server = net.createServer((c) => {


    console.log(constServer.CONNECT);
    c.on('end', () => {
        methods.workWithFile({type: 8}, ip).then((resolve, reject) => {
        });
        console.log(constServer.DISCONNECT);
    });

    let ip = Math.random().toString().slice(2, 11);
    console.log("c = ", c.localAddress);

    let allBuffer = '';

    c.on('data', data => {
        if (data[data.length - 1] === 3) {
            data = data.slice(0, data.length - 1);
            allBuffer += data.toString('utf8');
            console.log("allBuffer")
            methods.workWithFile(JSON.parse(allBuffer.toString('utf8')), ip).then((resolve, reject) => {
                let buf = Buffer.from(JSON.stringify(resolve) + '\u0003', 'utf8');
                c.write(buf)
            });
            allBuffer = '';
        } else {
            allBuffer += data;
        }
    });
});

server.on('error', (err) => {
    throw err;
});

server.listen(constServer.PORT, () => {
    console.log(constServer.BOUND);
});

