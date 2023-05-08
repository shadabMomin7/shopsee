
let { sequelizecon, DataTypes, Model, Op } = require("../init/dbconfig");

class Permission extends Model { }
Permission.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
    { tableName: "permission", modelName: "Permission", sequelize: sequelizecon }

);

module.exports = { Permission }