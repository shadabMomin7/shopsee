const { DATE } = require("sequelize");
let { sequelizecon, Model, DataTypes, Op } = require("../init/dbconfig");


class OrderProduct extends Model { }
OrderProduct.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    final_price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    package_location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    delivary_status: {
        type: DataTypes.BOOLEAN,
    },
    delivary_aspect_date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    delivary_date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    refund_status: { type: DataTypes.BOOLEAN },
    refund_reason: {
        type: DataTypes.STRING,
        allowNull: true
    },
    refund_pickup: {
        type: DataTypes.STRING,
        allowNull: false
    },
    refund_pickup_date: {
        type: DataTypes.DATE,
        defaultValue: DATE,
        allowNull: false
    },
    refund_amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
},
    { tableName: "order_product", modelName: "OrderProduct", sequelize: sequelizecon }
);

module.exports = { OrderProduct };

