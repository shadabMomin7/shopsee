let { sequelizecon, DataTypes, Model } = require("../init/dbconfig");


class ProductImage extends Model { }
ProductImage.init({
        id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
        },
        product_id: {
                type: DataTypes.INTEGER,
                allowNull: true
        },
        image_name: {
                type: DataTypes.STRING,
                allowNull: false
        },
        created_by: {
                type: DataTypes.INTEGER,
                allowNull: false
        }

},
        { tableName: "product_image", modelName: "ProductImage", sequelize: sequelizecon }
)


module.exports = { ProductImage };


