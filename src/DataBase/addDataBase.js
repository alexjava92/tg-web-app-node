const { Pool } = require('pg');
const { pool: poolConfig } = require('./configDB');
const logMessage = require("../log/logMessage"); // Путь к вашему конфигурационному файлу
// Создаем новый экземпляр pool используя параметры вашей базы данных.
const pool = new Pool(poolConfig);

// Функция для добавления нового пользователя
async function addUser(user_id, first_name, username, language_code, api_key) {
    const client = await pool.connect();


    const text =
        'INSERT INTO telegram_users (user_id, first_name, username, language_code, api_key) VALUES($1, $2, $3, $4, $5) RETURNING *';
    const values = [
        user_id,
        first_name,
        username,
        language_code,
        api_key
    ];

    try {
        const res = await pool.query(text, values);
        logMessage(
            'info',
            `Добавлен новый пользователь: ${JSON.stringify(res.rows[0])}`,
        );
        return res.rows[0];
    } catch (err) {
        logMessage('error', `Ошибка при добавлении пользователя: ${err.stack}`);
    } finally {
        client.release(); // Освобождаем соединение
    }
}

module.exports = addUser;