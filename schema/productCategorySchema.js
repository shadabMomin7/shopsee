let { sequelizecon, DataTypes, QueryTypes, Model, Op } = require("../init/dbconfig");

class Product_category extends Model { }
Product_category.init({
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
    created_by: {
        type: DataTypes.STRING,
        allowNull: false
    },
    updated_by: {
        type: DataTypes.STRING,
        allowNull: false
    }
},

    { tableName: "product_category", modelName: "Product_category", sequelize: sequelizecon }

);

module.exports = { Product_category }