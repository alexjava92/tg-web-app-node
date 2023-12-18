const axios = require("axios");

async function getWeightTransaction(outputs, apiKey) {
    console.log(outputs)
    try {
        const response = await axios.post(
            'https://btcnode.ru/api/get-weight-transaction',
            {
                outputs: outputs,
            },
            {
                headers: { 'api-key': apiKey },
            },
        );

        console.log('Ответ сервера:', response.data);
        return response.data
    } catch (error) {
        console.error(
            'Ошибка:',
            error.response ? error.response.data : error.message,
        );
    }
}

module.exports = getWeightTransaction;