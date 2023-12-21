const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const createWallet = require("./src/api/createNewUserWallet");
const {findUserById, getApiKeyByUserId} = require("./src/DataBase/getDataBase");
const createNewAddressBitcoin = require("./src/api/createNewAddressBitcoin");
const getBalanceUserWallet = require("./src/api/getBalanceUserWallet");
const sendBitcoin = require("./src/api/sendBitcoin");
const getWeightTransaction = require("./src/api/getWeightTransaction");
const getAllTransactions = require("./src/api/getAllTransactions")
const replaceByFee = require("./src/api/replaceByFee");
const checkForNewTransactions = require("./src/checkForNewTransactions");
const {addUser} = require("./src/DataBase/addDataBase");
const botManager = require('./src/botManager')
botManager.init('495082999:AAFG-JchEP7Kmr7iJAlwmxyTqy2qdeUVBmk');

const webAppUrl = 'https://warm-peony-e23eea.netlify.app'
const bot = botManager.getBot();
const app = express();

app.use(express.json());
app.use(cors());

setInterval(() => checkForNewTransactions(bot), 60000);

try {



bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const first_name = msg.chat.first_name || null;
    const username = msg.chat.username || null;
    const text = msg.text;
    const language_code = msg.from.language_code || null;

    const user = await findUserById(chatId)
    if (user === false) {
        console.log('Создаем кошелек')
        const userWallet = await createWallet();
        console.log(userWallet)
        const apiKey = userWallet.userWallet.apiKey;
        const mnemonic = userWallet.userWallet.mnemonic;
        const address = userWallet.userWallet.address;
        const masterKey = userWallet.userWallet.masterKey;
        console.log(apiKey)

        console.log('Добавляем пользователя')
        await addUser(chatId, first_name, username, language_code, apiKey)

        await bot.sendMessage(chatId, 'Кошелек bitcoin создан!\n' +
            `\n` +
            `Мнемоническая фраза: ${mnemonic}\n` +
            `\n` +
            `Мастер ключ: ${masterKey}\n` +
            `\n` +
            `⚠️ Держите эту информацию в секрете, с помощью мнемонической фразы вы сможете восстановить средства.`);

    }


    if (text === '/start')
        await bot.sendMessage(chatId, 'Ниже появиться кнопка', {
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Сделать заказ', web_app: {url: webAppUrl}}]
                    ]
                }
            },
            /*await bot.sendMessage(chatId, 'Ниже появиться кнопка', {
                reply_markup: {
                    keyboard: [
                        [{text: 'Открыть кошелек', web_app: {url: webAppUrl + '/wallet'}}]
                    ]
                }
            })*/
        );


    if (msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data)
            await bot.sendMessage(chatId, 'Спасибо за обратную связь')
            await bot.sendMessage(chatId, 'Ваша страна ' + data?.country)
            await bot.sendMessage(chatId, 'Ваша улица ' + data?.street)

            setTimeout(async () => {
                await bot.sendMessage(chatId, 'Всю информацию вы получите в этом чате')
            }, 3000)
        } catch (error) {
            console.log(error)
        }

    }
});

console.log('запрос')
app.post('/web-data', async (req, res) => {
    console.log('запрос поступил')
    const {queryId, products, totalPrice} = req.body;
    console.log(req.body.data)
    try {
        console.log(queryId)
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успешная покупка',
            input_message_content: {
                message_text: `
            Поздравляю с покупкой на сумму: ${totalPrice}, ${products.map(item => item.title).join(', ')}`
            }
        })
        return res.status(200).json({})
    } catch (e) {

        return res.status(500).json({})
    }
})

app.post('/web-new-bitcoin-address', async (req, res) => {
    console.log('запрос поступил /web-new-bitcoin-address')
    const {chatId} = req.body;
    console.log(req.body)
    try {
        console.log(chatId)
        const apiKey = await getApiKeyByUserId(chatId);
        console.log(apiKey)
        const address = await createNewAddressBitcoin(apiKey);
        console.log(address)

        return res.status(200).json({address})
    } catch (e) {

        return res.status(500).json({})
    }
})

app.post('/web-new-balance-user-wallet', async (req, res) => {
    console.log('запрос поступил /web-new-balance-user-wallet')
    const {chatId} = req.body;
    console.log(req.body)
    try {
        console.log(chatId)
        const apiKey = await getApiKeyByUserId(chatId);
        console.log(apiKey)
        const balance = await getBalanceUserWallet(apiKey);
        console.log(balance)

        return res.status(200).json({balance})
    } catch (e) {

        return res.status(500).json({})
    }
})

app.post('/web-new-send-bitcoin', async (req, res) => {
    console.log('запрос поступил /web-new-send-bitcoin')
    const {data} = req.body;
    console.log(req.body)
    try {
        console.log(data.chatId)
        const apiKey = await getApiKeyByUserId(data.chatId);
        console.log(apiKey)
        const transactionTxId = await sendBitcoin(data.outputs, data.satoshisPerByte, apiKey);
        console.log(transactionTxId)

        return res.status(200).json({transactionTxId})
    } catch (e) {

        return res.status(500).json({})
    }
})

app.post('/web-new-get-weight-transaction', async (req, res) => {
    console.log('запрос поступил /web-new-get-weight-transaction')
    const {data} = req.body;
    console.log(req.body)
    try {
        console.log(data.chatId)
        const apiKey = await getApiKeyByUserId(data.chatId);
        console.log(apiKey)
        const detailTransaction = await getWeightTransaction(data.outputs, apiKey);
        console.log(detailTransaction)

        return res.status(200).json({detailTransaction})
    } catch (e) {

        return res.status(500).json({})
    }
})

app.post('/web-new-get-all-transactions', async (req, res) => {
    console.log('запрос поступил /web-new-get-weight-transaction')
    const {chatId} = req.body;
    console.log(req.body)
    try {
        console.log(chatId)
        const apiKey = await getApiKeyByUserId(chatId);
        console.log(apiKey)
        const allTransactions = await getAllTransactions(apiKey);
        console.log('allTransactions', allTransactions)

        return res.status(200).json({allTransactions})
    } catch (e) {

        return res.status(500).json({})
    }
})

app.post('/web-new-get-valid-bitcoin-address', async (req, res) => {
    console.log('запрос поступил /web-new-get-valid-bitcoin-address');
    const { address } = req.body;
    console.log(req.body);

    try {
        const response = await fetch(`https://mempool.space/testnet/api/address/${address}`);

        if (response.ok) {
            // Если ответ успешный, возвращаем true
            return res.status(200).json({ isValid: true });
        } else {
            // Если ответ не успешный, но без ошибки, возвращаем false
            return res.status(200).json({ isValid: false });
        }
    } catch (error) {
        console.error("Ошибка при проверке адреса: ", error);
        // В случае ошибки запроса возвращаем false
        return res.status(500).json({ error });
    }
});

app.post('/web-new-replace-by-fee', async (req, res) => {
    console.log('запрос поступил /web-new-replace-by-fee')
    const {data} = req.body;
    console.log(req.body)
    try {
        console.log(data.chatId)
        const apiKey = await getApiKeyByUserId(data.chatId);
        console.log(apiKey)
        const transactionTxId = await replaceByFee(data.satoshisPerByte, data.originalTxId, apiKey);
        console.log(transactionTxId)

        return res.status(200).json({transactionTxId})
    } catch (e) {

        return res.status(500).json({})
    }
})


} catch (e) {
    console.log(e)
}

const PORT = 8000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`))
