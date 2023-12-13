const axios = require('axios');

async function createNewAddressBitcoin(apiKey) {
    try {
        console.log('Отправка запроса на сервер');
        const response = await axios.get('https://btcnode.ru/api/new-address', {
            headers: {
                'api-key': apiKey,
            },
        });
        console.log('Response:', response.data);
        return response.data
    } catch (error) {
        console.error(
            'Error:',
            error.response ? error.response.data : error.message,
        );
    }
}

module.exports = createNewAddressBitcoin;
