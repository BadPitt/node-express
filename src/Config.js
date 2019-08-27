require('dotenv').config();

module.exports = {
    webServer: {
        APP_PORT: process.env.PORT,
    },

    db: {
        DB: process.env.DB,
        DB_NAME: process.env.DB_NAME,
        DB_HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT,
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_CONNECT_TIMEOUT: process.env.DB_CONNECT_TIMEOUT,
        DB_IDLE_TIMEOUT: process.env.DB_IDLE_TIMEOUT,
    }
}