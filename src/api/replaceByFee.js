const axios = require("axios");

async function replaceByFee(satoshisPerByte, originalTxId, apiKey) {
    try {
        // Параметры для отправки в запросе
        const requestData = {
            satoshisPerByte: satoshisPerByte, // Пример значения, измените по необходимости
            originalTxId: originalTxId, // Пример TxId, измените на реальный
        };

        const response = await axios.post(
            'https://btcnode.ru/api/replace-by-fee',
            requestData,
            {
                headers: { 'api-key': apiKey }, // Замените '123456' на ваш реальный API-Key
            },
        );

        console.log('Ответ сервера:', response.data);
        return response.data;
    } catch (error) {

        console.error(
            'Ошибка:',
            error.response ? error.response.data : error.message,
        );
        return error.response ? error.response.data : error.message;
    }
}

module.exports = replaceByFee;