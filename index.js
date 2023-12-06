const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const token = '495082999:AAFG-JchEP7Kmr7iJAlwmxyTqy2qdeUVBmk';
const webAppUrl = 'https://warm-peony-e23eea.netlify.app'
const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());


bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === '/start')
        await bot.sendMessage(chatId, 'Ниже появиться кнопка', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Сделать заказ', web_app: {url: webAppUrl}}]
                ]
            }
        });
    await bot.sendMessage(chatId, 'Ниже появиться кнопка', {
        reply_markup: {
            keyboard: [
                [{text: 'Сделать заказ', web_app: {url: webAppUrl + '/form'}}]
            ]
        }
    });

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

app.post('/web-data', async (req, res) => {
    const {queryId, products = [], totalPrice} = req.body;
    console.log(req.body)
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успешная покупка',
            input_message_content: {
                message_text: `
            Поздравляю с покупкой на сумму: ${totalPrice},
            ${products.map(item => item.title).join(', ')}`
            }
        })
        return res.status(200).json({})
    } catch (e) {

        return res.status(500).json({})
    }


})

const PORT = 8000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`))