// let cors = require("cors");

let originAllow = ["http://abc.com", "http://pqr.com"];
let corsconfig = (origin, callback) => {
    if (originAllow.indexOf(origin) == -1) {
        return callback({error:"you are not whitelisted"}, false);

    }
    return callback(null, true);
}

module.exports = { corsconfig }