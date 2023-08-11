const { DATE } = require("sequelize");
let { Model, sequelizecon, DataTypes } = require("../init/dbconfig");

class Order extends Model { }
Order.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: ture
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total_original_price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total_discounted_amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total_gst_amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    billable_amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    payment_mode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    payment_channel: {
        type: DataTypes.STRING,
        allowNull: false
    },
    paid_amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    payment_details: {
        type: DataTypes.STRING,
        allowNull: false
    },
    payment_date: {
        type: DataTypes.DATE,
        defaultValue: DATE,
        allowNull: false
    },
    payment_status: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    order_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DATE
    },
    order_status: {
        type: DataTypes.BOOLEAN,
    },
    delivary_address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    delivary_contact_no: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    delivary_person: {
        type: DataTypes.STRING,
        allowNull: false
    },
    delivary_status: {
        type: DataTypes.BOOLEAN,
    },
    is_refunded: {
        type: DataTypes.BOOLEAN,
    },
    created_by: {
        type: DataTypes.STRING,
        allowNull: false
    },
    updated_by: {
        type: DataTypes.STRING,
        allowNull: false
    }

}, { tableName: "order", modelName: "Order", sequelize: sequelizecon }
);



module.exports = {Order};
