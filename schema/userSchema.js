let { Model, DataTypes, sequelizecon, Op } = require("../init/dbconfig");

class User extends Model { }
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

    { tableName: "user", ModelName: "user", sequelize: sequelizecon }
);

module.exports = { User }   