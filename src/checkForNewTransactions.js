// Функция для проверки наличия новых входящих транзакций
const {getUsers, getProcessedTransactions} = require("./DataBase/getDataBase");
const getAllTransactions = require("./api/getAllTransactions");
const {insertProcessedTransaction} = require("./DataBase/addDataBase");
const {convertSatoshisToBitcoin} = require("./calculator/convertSatoshisToBitcoin");


const checkForNewTransactions = async (bot) => {
    try {
        const users = await getUsers();
        const processedTransactions = await getProcessedTransactions();

        for (const user of users) {
            console.log(user)
            const transactions = await getAllTransactions(user.api_key);
            for (const transaction of transactions) {
                if (!processedTransactions.includes(transaction.txid) && transaction.transactionType === 'Incoming') {
                    await sendTelegramNotification(bot, user.user_id, transaction);
                    // Записываем новую транзакцию в базу данных
                    await insertProcessedTransaction(transaction.txid);
                }
            }
        }
    } catch (e) {
        console.log(e)
    }
};


// Функция для отправки уведомлений в Telegram
const sendTelegramNotification = async (bot, chatId, transaction) => {
    console.log('chatId', chatId)
    console.log('transaction', transaction)
    const message = `✅ Ваш кошелек пополнен на ${convertSatoshisToBitcoin(transaction.amountReceived)} BTC.\n\nТранзакция: ${transaction.txid}\n`;
    await bot.sendMessage(chatId, message);
};


module.exports = checkForNewTransactions;

