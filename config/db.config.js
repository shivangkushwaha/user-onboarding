require("dotenv").config();
module.exports = {
    HOST: process.env.HOST,
    USER: process.env.MYSQL_USER,
    PASSWORD: process.env.PASSWORD,
    DB: process.env.NODE_ENV == "test" ? process.env.TEST_DB : process.env.DB,
    TEST_DB: process.env.TEST_DB,
    dialect: process.env.DIALECT,
    PORT: process.env.PORT,
    pool: {
        max: process.env.MAX,
        min: process.env.MIN,
        acquire: process.env.ACQUIRE,
        idle: process.env.IDLE,
    },
};
