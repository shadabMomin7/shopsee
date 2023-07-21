const { date } = require("joi");
let { sequelizecon, DataTypes, QueryTypes, Model, Op } = require("../init/dbconfig");

class Products extends Model { }
Products.init({
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
    base_price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    gst_on_base_price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    base_price_with_gst: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    discription: {
        type: DataTypes.STRING,
        allowNull: false
    },
    details: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stocks: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    stocks_alert: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rating: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    discount_type: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    Gst: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    discount_price: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    discount_percentage: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    gst_on_discount: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    discount_with_gst: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    final_gst: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price_after_discount: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    total_amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
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
        type: DataTypes.STRING,
        allowNull: false
    },
    updated_by: {
        type: DataTypes.STRING,
        allowNull: false
    }

},

    { tableName: "product", modelName: "Products", sequelize: sequelizecon }

);

module.exports = { Products }