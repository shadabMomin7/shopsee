let { Sequelize, DataTypes, Model, QueryTypes, Op } = require("sequelize");

let sequelizecon = new Sequelize("mysql://root:@localhost/pac");

sequelizecon.authenticate().then((data) => {console.log("connected to PAC DB")})
                           .catch((error) => {console.log("error on PAC Db connection")});

module.exports = { DataTypes, Model, QueryTypes, Op, sequelizecon };



