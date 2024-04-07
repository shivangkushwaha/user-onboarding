const appConstant = require("../../appConstant");

module.exports = (sequelize, Sequelize) => {
    const Token = sequelize.define("Token", {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        token: {
            type: Sequelize.STRING,
            allowNull: false 
        },
        status: {
            type: Sequelize.INTEGER,
            allowNull: false ,
            defaultValue: appConstant.STATUS.ACTIVE
        },
        email: {
            type: Sequelize.STRING,
            allowNull: true 
        },
        phone: {
            type: Sequelize.STRING,
            defaultValue: null
        },
        countryCode: {
            type: Sequelize.STRING,
            defaultValue: null
        }, 
        userId: {
            type: Sequelize.INTEGER,
            allowNull: true 
        },
        otp:{
            type: Sequelize.STRING,
            allowNull: true
        },
        uuid: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        }
    },{
        tableName:"tokens",
        paranoid: true,
        underscored: true
    });
    Token.associate = function(models) {
        Token.belongsTo(models.User,{
            Token:"userId",
        })
      }
    return Token;
};