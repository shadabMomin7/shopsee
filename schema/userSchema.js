let { Model, DataTypes, sequelizecon, Op } = require("../init/dbconfig");

class User extends Model { }
// 1 parameter init
User.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    token:{
        type:DataTypes.STRING,
        allowNull:true
    },
    otp:{
        type:DataTypes.STRING,
        allowNull:true
    }
},
    //2 parameter  table configurations
    { tableName: "user", modelName: "User", sequelize: sequelizecon }
);

module.exports = { User };