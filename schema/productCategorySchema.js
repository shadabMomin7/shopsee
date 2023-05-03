const { date } = require("joi");
let { sequelizecon, DataTypes, QueryTypes, Model, Op } = require("../init/dbconfig");

class product_category extends Model { }
product_category.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
},

    { tableName: "product_category", modelName: "product_category", sequelize: sequelizecon }

);

module.exports = { product_category }