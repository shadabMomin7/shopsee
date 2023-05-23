let { sequelizecon, DataTypes, Model } = require("../init/dbconfig");


class ProductImage extends Model { }
ProductImage.init({
        id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
        },
        p_id: {
                type: DataTypes.INTEGER,
                allowNull: true
        },
        image_url: {
                type: DataTypes.STRING,
                allowNull: false
        },
        created_by: {
                type: DataTypes.INTEGER,
                allowNull: false
        }

},
        { tableName: "product_image", modelName: "Product", sequelize: sequelizecon }
)


module.exports = { ProductImage };

