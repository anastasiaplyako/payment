const net = require('net');
const methods = require('./methodsServer');

const server = net.createServer((c) => {
    // 'connection' listener.
    console.log('client connected');
    c.on('end', () => {
        console.log('client disconnected');
    });
    //c.pipe(c);

    console.log("c = ", c.localAddress);
    c.on('data', data => {
        console.log("data = ", JSON.parse(data.toString()));
        methods.workWithFile(JSON.parse(data.toString()), c.localAddress).then((resolve, reject) => {
            console.log("res = ", resolve);
            c.write(Buffer.from(JSON.stringify(resolve)));
        });
    });
});

server.on('error', (err) => {
    throw err;
});

server.listen(8124, () => {
    console.log('server bound');
});

