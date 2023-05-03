let jwt = require("jsonwebtoken");
// let bcrypt = require("bcrypt");

function encrypt(data, key) {
    return new Promise((res, rej) => {
        jwt.sign(data, key, (err, data) => {
            if (err) { rej(err) }
            res(data)
        });
    });
}

function decrypt(data, key) {
    return new Promise((res, rej) => {
        jwt.verify(data, key, (err,data) => {
            if (err) { rej(err) }
            console.log(data)
            res(data)
        });
    });
}

module.exports = { encrypt, decrypt }