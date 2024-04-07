const appConstant = require("../../appConstant");

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: false,
      },
      password: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue: appConstant.STATUS.ACTIVE, // 1 active , 0 blocked by admin
      },
      isTokenExpire: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: appConstant.STATUS.INACTIVE,
      },
      isEmailVerify: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isPhoneVerify: {
        type: Sequelize.BOOLEAN,
        allowNull: false, 
        defaultValue: false,
      },
      countryCode:{
        type: Sequelize.STRING,
        allowNull: false, 
        defaultValue: false,
      },
      isProfileComplete: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
    }
    },    
    {
      tableName: "users",
      paranoid: true,
      underscored: true,
      indexes: [
        {
          unique: false,
          fields: ["email"],
        },
        { type: "FULLTEXT", name: "full_text", fields: ["email"] },
      ],
    }
  );
  User.associate = function (models) {
    User.hasOne(models.UserProfile, {
      foreignKey: "userId",
      as: "profile",
    }),
      User.belongsToMany(models.Role, {
        foreignKey: "userId",
        through: "user_roles",
      })
  }; 

  return User;
};
