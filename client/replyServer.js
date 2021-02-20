const constClient = require("./constClient");
//принимаешь запросы от сервера
/*
1 - сервер отправляет все id кошельков (полю ids json объекта).
2 - чтобы увидеть сумму на кошельке, обратись к полю amount json объекта
5 - О ноу! Это ошибка. чтобы увидеть сообщение об ошибке, обратись к полю msg json объекта
6 - все хорошо

    2
{
    type: 2,
    amount: 234
}
 */
module.exports.reply = (replyPacketServer) => {
    switch (replyPacketServer.type) {
        /*
        Отправляет все id кошельков
        {
            type: 1,
            ids: [1, 2, 3]
        }
        * */
        case (1): {
            console.log(constClient.ALL_WALLET, replyPacketServer.ids.toString());
            break;
        }
        /*
        Отправляет количество денег в кошельке
        {
            type: 2,
            amount: 0
        }
        * */
        case (2): {
            console.log(constClient.AMOUNT, replyPacketServer.amount.toString());
            break;
        }
        /*
        специальный тип, созданный для проверки нормальной работы больших сообщений
        {
            type: 3,
            text: "тут очень большой текст"
        }
        * */
        case (3): {
            console.log(replyPacketServer.text);
            break;
        }
        /*
        все плохо
        {
            type: 5,
            msg: "Текст ошибки"
        }
        * */
        case (5): {
            console.log(constClient.ERROR, replyPacketServer.msg);
            break;
        }
        /*
           все хорошо
           {
               type: 6
           }
       * */
        case (6): { // все хорошо
            console.log(constClient.OK);
            break;
        }
        default: {
            console.log(constClient.NO_REPLY)
        }
    }
}