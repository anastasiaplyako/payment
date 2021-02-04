const constClient = require("./constClient");
//принимаешь запросы от сервера
/*
1 - сервер отправляет все id кошельков (полю ids json объекта).
2 - чтобы увидеть сумму на кошельке, обратись к полю amount json объекта
5 - О ноу! Это ошибка. чтобы увидеть сообщение об ошибке, обратись к полю msg json объекта
6 - все хорошо
 */
module.exports.reply = (replyPacketServer) => {
    switch (replyPacketServer.type) {
        case (1): {
            console.log(constClient.ALL_WALLET, replyPacketServer.ids.toString());
            break;
        }
        case (2): {
            console.log(constClient.AMOUNT, replyPacketServer.amount.toString());
            break;
        }
        case (5): {
            console.log(constClient.ERROR, replyPacketServer.msg);
            break;
        }
        case (6): {
            console.log(constClient.OK);
            break;
        }
        default: {
            console.log(constClient.NO_REPLY)
        }
    }
}