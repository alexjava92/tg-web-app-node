const axios = require("axios");

async function sendBitcoin(outputs, satoshisPerByte, apiKey) {
    console.log(outputs)
    try {
        const response = await axios.post(
            'https://btcnode.ru/api/send-bitcoin',
            {
                outputs: outputs,
                satoshisPerByte: satoshisPerByte, // Пример значения, измените по необходимости
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

module.exports = sendBitcoin;