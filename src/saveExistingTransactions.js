const { getUsers } = require('./DataBase/getDataBase');
const getAllTransactions = require('./api/getAllTransactions');
const {insertProcessedTransaction} = require("./DataBase/addDataBase");


const saveExistingTransactions = async () => {
    const users = await getUsers();
    for (const user of users) {
        try {
            const transactions = await getAllTransactions(user.api_key);
            for (const transaction of transactions) {
                await insertProcessedTransaction(transaction.txid);
            }
        } catch (error) {
            console.error(`Ошибка при обработке пользователя ${user.id}:`, error);
        }
    }
    console.log('Все существующие транзакции были успешно сохранены.');
};

saveExistingTransactions();
