let { Model, DataTypes, sequelizecon, Op } = require("../init/dbconfig");

class Category extends Model { }
Category.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    p_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }

},

    { tableName: "category", Modelname: "category", sequelize: sequelizecon }

);

module.exports = { Category }

