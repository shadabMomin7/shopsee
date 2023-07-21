let { sequelizecon, Model, DataTypes, QueryTypes } = require("../init/dbconfig");

class AddToCart extends Model { }
AddToCart.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    user_id: {
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
    }


},
  {tableName : "add_To_Cart" , modelName : "AddToCart" , sequelize : sequelizecon}
)


module.exports = {AddToCart};


