let {Model,sequelizecon,DataTypes} = require ("../init/dbconfig");

class Order extends Model{}
Order.init({
           id : {type : DataTypes.INTEGER,
                 allowNull :false ,
                 autoIncrement : true,
                 primaryKey : ture},
        user_id : { type : DataTypes.INTEGER,
                  allowNull : false },
        product_id : {type : DataTypes.INTEGER , 
            allowNull : false },
        
        
                        
})