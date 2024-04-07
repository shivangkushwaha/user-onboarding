const appConstant = require("../../appConstant");

module.exports = (sequelize, Sequelize) => {
  const UserProfile = sequelize.define(
    "UserProfile",
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      dob: {
        type: Sequelize.DATE,
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      isCompleted: {
        type: Sequelize.INTEGER,
        defaultValue: appConstant.STATUS.INACTIVE
      },
      image : {
        type: Sequelize.STRING,
        allowNull: true
      }
    },
    {
      tableName: "user_profiles",
      paranoid: true,
      underscored: true,
      indexes: [
        {
          unique: false,
          fields: ["name"],
        },
        { type: "FULLTEXT", name: "full_text", fields: ["name"] },
      ],
    }
  );
  UserProfile.associate = function (models) {
  }; 

  return UserProfile;
};
