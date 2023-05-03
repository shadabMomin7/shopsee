const { date } = require("joi");
let { sequelizecon, DataTypes, QueryTypes, Model, Op } = require("../init/dbconfig");

class products extends Model { }
products.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    details: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    stocks: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    stock_alart: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rating: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    discount_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    discounted: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    price_after_discount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    updated_by: {
        type: DataTypes.INTEGER,
        allowNull: false
    }

},

    { tableName: "products", modelName: "products", sequelize: sequelizecon }

);

module.exports = { products }