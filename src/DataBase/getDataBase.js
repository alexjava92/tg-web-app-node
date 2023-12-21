const { Pool } = require('pg');
const { pool: poolConfig } = require('./configDB');
const logMessage = require("../log/logMessage");
// Путь к вашему конфигурационному файлу
// Создаем новый экземпляр pool используя параметры вашей базы данных.
const pool = new Pool(poolConfig);

// Функция для поиска пользователя по user_id
async function findUserById(user_id) {
    const client = await pool.connect();

    const text = 'SELECT * FROM telegram_users WHERE user_id = $1';
    const values = [user_id];

    try {
        const res = await pool.query(text, values);

        if (res.rows.length > 0) {
            // Если найден пользователь, возвращаем его данные
            logMessage('info', `Найден пользователь: ${JSON.stringify(res.rows[0])}`);
            return true;
        } else {
            // Если пользователь не найден, возвращаем null или другое значение по умолчанию
            logMessage('info', `Пользователь с user_id ${user_id} не найден`);
            return false;
        }
    } catch (err) {
        logMessage('error', `Ошибка при поиске пользователя: ${err.stack}`);
    } finally {
        client.release(); // Освобождаем соединение
    }
}

async function getApiKeyByUserId(user_id) {
    const client = await pool.connect();

    const text = 'SELECT api_key FROM telegram_users WHERE user_id = $1';
    const values = [user_id];

    try {
        const res = await pool.query(text, values);

        if (res.rows.length > 0) {
            // Если найден пользователь, возвращаем его api_key
            const api_key = res.rows[0].api_key;
            logMessage('info', `API Key найден для пользователя с user_id ${user_id}: ${api_key}`);
            return api_key;
        } else {
            // Если пользователь не найден, возвращаем null или другое значение по умолчанию
            logMessage('info', `Пользователь с user_id ${user_id} не найден`);
            return null;
        }
    } catch (err) {
        logMessage('error', `Ошибка при поиске API Key: ${err.stack}`);
    } finally {
        client.release(); // Освобождаем соединение
    }
}
// Получаем всех пользователей БД
const getUsers = async () => {
    const client = await pool.connect();

    const query = 'SELECT * FROM telegram_users';

    try {
        const res = await pool.query(query);

        if (res.rows.length > 0) {
            // Если найдены пользователи, возвращаем их данные
            logMessage('info', `Найдены пользователи: ${JSON.stringify(res.rows)}`);
            return res.rows;
        } else {
            // Если пользователи не найдены, возвращаем пустой массив
            logMessage('info', 'Пользователи не найдены');
            return [];
        }
    } catch (err) {
        logMessage('error', `Ошибка при получении списка пользователей: ${err.stack}`);
        return []; // Возвращаем пустой массив в случае ошибки
    } finally {
        client.release(); // Освобождаем соединение
    }
};
// Получаем все транзакции из БД
const getProcessedTransactions = async () => {
    const client = await pool.connect();
    const queryText = 'SELECT txid FROM processed_transactions'; // Убедитесь, что имя таблицы и столбца соответствуют вашей базе данных
    try {
        const res = await client.query(queryText);
        return res.rows.map(row => row.txid);
    } catch (err) {
        console.error(`Ошибка при получении транзакций: ${err.stack}`);
        return [];
    } finally {
        client.release();
    }
};



module.exports = {
    findUserById,
    getApiKeyByUserId,
    getUsers,
    getProcessedTransactions,
};

/*// Пример использования функции поиска пользователя
const user =  findUserById(123456);

if (user) {
    console.log('Найден пользователь:', user);
} else {
    console.log('Пользователь не найден.');
}*/
// Пример использования
/*
const user_id = '194857311';
const apiKey =  getApiKeyByUserId(user_id);

if (apiKey !== null) {
    // Вы можете использовать apiKey здесь
    console.log('API Key:', apiKey);
} else {
    console.log('API Key не найден для указанного user_id.');
}*/
