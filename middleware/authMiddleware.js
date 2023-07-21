const { sequelizecon, QueryTypes } = require("../init/dbconfig");
let { decrypt } = require("../helper/securityHelper");
let { logger } = require("../helper/log");


// auth function 
function auth(permission) {
    return async (req, res, next) => {
        //checking params data is there or not
        if (!permission) {
            return res.status(401).send({ error: " You don't have any permission " });
        }
        // request token in headers
        let token = (req.headers && req.headers.token) ? req.headers.token : null;
        if (!token) {
            return res.status(404).send({ error: "token not found in headers" });
        }
        /// token decryption
        let data = await decrypt(token,"shadab@123").catch((err) => {return { error: err }});
        if (!data || (data && data.error)) {
            return res.status(401).send({ error: "unautherized | invalid token " });
        }
        /// join table with query
                                            /// firt parameter query
        let user = await sequelizecon.query(`SELECT user.id,user.name,p.name as permission from user
        left join user_permission as up on up.user_id=user.id
        left join permission as p on up.permission_id=p.id
        where user.id=:key and user.token=:token`, 
        // secound parameter configuration
        { replacements:{key: data.id , token : token},
            type: QueryTypes.SELECT
        }).catch((err) => { return { error: err } });
       
        /// check user data
        if (!user || (user && user.error)) {
            
            return res.status(401).send({ error: "user not found" });
        }
        // formating permissions
        let permissions = {};
        for (let i of user) {
            permissions[i.permission] = true
        }
        // if not found any permission then return 
        if (!permissions || permissions.lenght <= 0 || !permissions[permission]) {
            logger("error",`Auth error- ${permission} permission not found for user ${user.id}`);
            return res.status(401).send({ error: "access denied" });
        }
        // creating valid user data (for use)
        req.userdata = { id:user[0].id, name: user[0].name, permissions: permissions }
        
        next();
    }
}

module.exports = { auth }