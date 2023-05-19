let { Model, DataTypes, sequelizecon, Op } = require("../init/dbconfig");

class User_permission extends Model { }
User_permission.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    permission_id: {
        type: DataTypes.STRING,
        allowNull: true
    },

},

    { tableName: "user_permission", modelName: "User_permission", sequelize: sequelizecon }
);

module.exports = { User_permission }   