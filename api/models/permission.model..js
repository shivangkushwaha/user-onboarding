module.exports = (sequelize, Sequelize) => {
    const Permission = sequelize.define("Permission", {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        isBasic:{
            type:Sequelize.INTEGER,
            defaultValue:0
        },
        code: { otherKey:"userId",
            type: Sequelize.STRING,
        },
        uuid: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        }
    },{
        tableName:"permissions",
        paranoid: true,
        underscored: true
    });
    Permission.associate = function(models) {
        Permission.belongsToMany(models.Role, {
              foreignKey: "roleId",
              through:"role_permissions"
            })
          }

    return Permission;
};