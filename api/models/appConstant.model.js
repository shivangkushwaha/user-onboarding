
module.exports = (sequelize, Sequelize) => {
    const AppConstant = sequelize.define(
        "AppConstant",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            key: {  type: Sequelize.STRING, allowNull: false },
            value: {  type: Sequelize.STRING, defaultValue: null },
            data: { type: Sequelize.JSON, defaultValue: null  },
            uuid: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 }
        },
        {
            underscored: true,
            tableName: "app_constants"
        }
    );

    AppConstant.associate = (models) => {

    };
    
    return AppConstant;
}