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
    user_id : { type : DataTypes.INTEGER ,
                  allowNull : false},
    payment_mode : { type : DataTypes.STRING ,
                     allowNull : false} ,
    payment_channel : {type : DataTypes.STRING , 
                       allowNull : false},
    paid_amount : {type : DataTypes.INTEGER ,
                    allowNull : false},
    payment_details : {type : DataTypes}




})