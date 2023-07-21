// let cors = require("cors");
let {logger} = require('../helper/log');

let originAllow = ["http://abc.com", "http://pqr.com"];
let corsconfig = (origin, callback) => {
    if (originAllow.indexOf(origin) == -1) {
        logger("error",` :Cors-Error: from Cors Middleware line No:7  domain ${origin}`)

        return callback("you are not whitelisted", false);

    }
    return callback(null, true);
}

module.exports = { corsconfig }