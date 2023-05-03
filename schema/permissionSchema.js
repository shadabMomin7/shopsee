
let { sequelizecon, DataTypes, Model, Op } = require("../init/dbconfig");

class permission extends Model { }
permission.init({
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
    { tableName: "permission", modelName: "permission", sequelize: sequelizecon }

);

module.exports = { permission }