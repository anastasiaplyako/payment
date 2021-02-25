//создание пакетов

function Packet(opcode) {
    this.opcode = opcode;
    return this;
}

Packet.OPCODE = {
    REG: 0x00,
    GETWAL: 0x01,
    CHECK: 0x02,
    LOGIN: 0x03,
    LOGOUT: 0x04,
    PUT: 0x05,
    TAKE_OFF: 0x06,
    TRANSFER: 0x07,
    BIG_MSG: 0x08,
    BIG_MSG_SRV: 0x09
};

Packet.createRegister = (login, password) => {
    return {
        type: Packet.OPCODE.REG,
        login: login,
        password: password,
    }
}

Packet.createGetWallets = () => {
    return {
        type: Packet.OPCODE.GETWAL,
    }
}

Packet.createLogIn = (login, password) => {
    return {
        type: Packet.OPCODE.LOGIN,
        login: login,
        password: password,
    }
}

Packet.createLogout = () => {
    return {
        type: Packet.OPCODE.LOGOUT,
    }
}

Packet.createCheckWallet = () => {
    return {
        type: Packet.OPCODE.CHECK,
    }
}

Packet.createPut = (amount) => {
    return {
        type: Packet.OPCODE.PUT,
        amount
    }
}

Packet.createTakeOff = (amount) => {
    return {
        type: Packet.OPCODE.TAKE_OFF,
        amount
    }
}

Packet.createTransfer = (amount, billingWalletId) => {
    return {
        type: Packet.OPCODE.TRANSFER,
        amount,
        billingWalletId
    }
}

//для проверки, что норм работает большие сообщения
Packet.createBigMsg = () => {
    let str = "Николай Гоголь родился в селе Сорочинцы Полтавской губернии, которая на тот момент входила в состав Российской империи. Его отец, Василий Гоголь-Яновский, был коллежским асессором и служил на почте, но в 1805 году вышел в отставку, женился и стал заниматься хозяйством. Вскоре он подружился с бывшим министром Дмитрием Трощинским, который жил в соседнем селе. Вместе они создали домашний театр. Гоголь-Яновский сам писал комедии для представлений на украинском языке, а сюжеты брал из народных сказок. Мария Косяровская вышла за него замуж в 14 лет и посвятила себя семье. Она вспоминала: «Я не выезжала ни на какие собрания и балы, находя все счастье в своем семействе; мы не могли разлучаться друг от друга ни на один день, и когда он ездил по хозяйству в поле в маленьких дрожках, то всегда брал меня с собою». Николай Гоголь был третьим ребенком в семье, первые двое сыновей родились мертвыми. Будущего писателя назвали в честь святого Николая: незадолго до родов мать молилась именно ему. Позже в семье появилось еще восемь детей, однако в живых остались только дочери Мария, Анна, Елизавета и Ольга. Гоголь много времени проводил с сестрами и даже занимался с ними рукоделием: кроил занавески и платья, вышивал, вязал спицами шарфы. Ольга вспоминала: «Он ходил к бабушке и просил шерсти, вроде гаруса, чтобы поясок: на гребенке ткал пояски». Он рано увлекся и сочинительством. Отец брал его в поля и дорогой давал темы для стихотворных импровизаций: «степь», «солнце», «небеса». В пять лет Гоголь уже начал сам записывать свои произведения. Мать была суеверной и вечерами часто рассказывала детям истории про леших, домовых и нечистую силу."
    str = str.repeat(10);
    //console.log("str = ", str);
    return {
        type: Packet.OPCODE.BIG_MSG,
        text: str
    }
}

Packet.createBigMsgServer = () => {
    return {
        type: Packet.OPCODE.BIG_MSG_SRV
    }
}


module.exports = Packet;