const axios = require("axios");

async function getAllTransactions(apiKey) {
    try {
        console.log('Отправка запроса на сервер для получения всех транзакций');
        const response = await axios.get(
            'https://btcnode.ru/api/get-all-transactions',
            {
                headers: {
                    'api-key': apiKey,
                },
            },
        );
        console.log('Response:', response.data);
        return response.data
    } catch (error) {
        console.error(
            'Error:',
            error.response ? error.response.data : error.message,
        );
    }
}

module.exports = getAllTransactions;