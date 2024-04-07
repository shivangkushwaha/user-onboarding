const dbConfig = require("../../config/db.config");
const Sequelize = require("sequelize");
const logger = require("../../utils/winston");
const Fs = require("fs")
const Path = require("path")
require("dotenv").config()

console.info(`Setting Db Connection With Host:- ${dbConfig.HOST} on port :- ${dbConfig.PORT}`)
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: 0,
    port:dbConfig.PORT,
    pool: {
        max:+ dbConfig.pool.max,
        min: +dbConfig.pool.min,
        acquire: +dbConfig.pool.acquire,
        idle:+ dbConfig.pool.idle
    },
    logging: function (msg) {
        logger.info(msg);
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


Fs.readdirSync(__dirname).filter(function (file) {
    return file.indexOf(".") !== 0 && file !== "index.js";
})
.forEach(function (file) {
    var model = require(Path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    db[model.name] = model;
});
Object.keys(db).forEach(function (modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});


module.exports = db
