const Packet = require('./server/packetServer');
const Connection = require('./server/connection');

const BLOCK_SIZE = 512;
const ERROR = 2;

const TFTP = (host, port) => {
    const addressInfo = {address: host, port};
    const client = new Connection(addressInfo);
    const reset = () => client.setRemoteDescription(addressInfo);
    return {
        close() {
            return client.close();
        },

        async read(filename, push, done) {
            let block = 0, addressInfo, data;
            await reset();
            await client.sendRequest(Packet.OPCODE.RRQ, filename);
            while (true) {
                ({addressInfo: addressInfo, block, data} = await client.waitBlock(block + 1));
                if (!addressInfo) break;
                else {
                    console.log('received block(%s) size(%s), from %s:%s', block, data.length, addressInfo.address, addressInfo.port);
                    await push(data);
                    await client.setRemoteDescription(addressInfo);
                    await client.sendAck(block);
                    if (data.length < BLOCK_SIZE) {
                        done();
                        break;
                    }
                }
            }
        },

        async write(filename, data) {
            let block, addressInfo;
            await reset();
            await client.sendRequest(Packet.OPCODE.REG, filename);
            const blocks = Math.floor(data.length / BLOCK_SIZE | 0) + 1;
            let start, end;
            let error = 0
            for (var i = 0; i < blocks; i++) {
                if (error === ERROR) break;
                for (error = 0; error < ERROR; error++) {
                    ({addressInfo: addressInfo, block} = await client.waitAck(i));
                    if (!addressInfo) {
                        console.log('send error! try again');
                        block = i;
                        await client.sendBlock(block + 1, data.slice(start, end));
                    }
                    else {
                        await client.setRemoteDescription(addressInfo);
                        console.log('request block %s, from %s:%s', block, addressInfo.address, addressInfo.port);
                        start = block * BLOCK_SIZE;
                        end = Math.min(start + BLOCK_SIZE, data.length);
                        await client.sendBlock(block + 1, data.slice(start, end));
                        break;
                    }
                }


            }
        }
    };
};

TFTP.Client = TFTP;
TFTP.Packet = Packet;
TFTP.Server = require('./server/TFTPServer');
TFTP.createServer = () => new TFTP.Server();

module.exports = TFTP;