module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("Role", {
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
        code: {
            type: Sequelize.STRING,
        },
        uuid: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        }
    },{
        tableName:"roles",
        paranoid: true,
        underscored: true
    });
 Role.associate = function(models) {
    Role.belongsToMany(models.Permission, {
          foreignKey: "permissionId",
          through:"role_permissions"
        })
        Role.belongsToMany(models.User,{
            foreignKey:"roleId",
            through:"user_roles"
        })
      }
    return Role;
};