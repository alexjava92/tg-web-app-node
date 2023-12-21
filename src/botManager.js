// botManager.js
let botInstance;

module.exports = {
    init: (token) => {
        const TelegramBot = require('node-telegram-bot-api');
        if (!botInstance) {
            botInstance = new TelegramBot(token, { polling: true });
        }
    },
    getBot: () => {
        if (!botInstance) {
            throw new Error("botInstance has not been initialized.");
        }
        return botInstance;
    }
};
