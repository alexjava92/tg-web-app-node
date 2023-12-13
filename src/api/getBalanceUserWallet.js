const axios = require("axios");

async function getBalanceUserWallet(apiKey) {
    try {
        console.log('Отправка запроса на сервер');
        const response = await axios.get('https://btcnode.ru/api/balance', {
            headers: {
                'api-key': apiKey,
            },
        });
        console.log('Response:', response.data);
        return response.data;
    } catch (error) {
        console.error(
            'Error:',
            error.response ? error.response.data : error.message,
        );
    }
}

module.exports = getBalanceUserWallet;

