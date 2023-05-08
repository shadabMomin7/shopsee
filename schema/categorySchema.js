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
    },
    created_by : {type : DataTypes.INTEGER,
                  allowNull : false
         },
    updated_by: {type : DataTypes.INTEGER,
                 allowNull : false
          }     


},

    { tableName: "category", Modelname: "Category", sequelize: sequelizecon }

);

module.exports = { Category }

