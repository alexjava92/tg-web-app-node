const axios = require('axios');
const {create} = require("axios");


async function createWallet() {
    try {
        console.log('Отправка запроса на сервер');
        const response = await axios.get('https://btcnode.ru/api/new-user-wallet');
        console.log('Response:', response.data);
        return response.data
    } catch (error) {
        console.error(
            'Error:',
            error.response ? error.response.data : error.message,
        );
    }
}

module.exports = createWallet;

