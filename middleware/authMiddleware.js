const { sequelizecon, QueryTypes } = require("../init/dbconfig");
const { permission } = require("../schema/permissionSchema")
let { decrypt } = require("../helper/securityHelper")


// auth function 
function auth(permission) {
    return async (req, res, next) => {
        //checking param me data h ya nhi
        if (!permission) {
            return res.status(401).send({ error: "not autherized" });
        }
        //
        let token = (req.headers && req.headers.token) ? req.headers.token : null;
        if (!token) {
            
            return res.status(404).send({ error: "token not found" });
        }
        console.log("token",token)
        let data = await decrypt(token,"shadab@123").catch((err) => {
            return { error: err }
        });
        if (!data || (data && data.error)) {
            console.log("error from middleware", data.error)
            return res.status(401).send({ error: "unautherized" });
        }

        let user = await sequelizecon.query(`SELECT user.id,user.name,p.name as permission from user
        left join user_permission as up on up.user_id=user.id
        left join permission as p on up.permission_id=p.id
        where user.id=:key and user.token=:token`, {
            replacements:{key:data.id,token:token},
            type: QueryTypes.SELECT
        }).catch((err) => { return { error: err } });
        if (!user || (user && user.error)) {
            
            return res.status(401).send({ error: "user not found" });
        }

        let permissions = {};
        for (let i of user) {
            permissions[i.permission] = true
        }
        if (!permissions || permissions.lenght <= 0 || !permissions[permission]) {
            console.log(permission)
            return res.status(401).send({ error: "access denied" });
        }
        
        req.userdata = { id:user[0].id, name: user[0].name, permissions: permission }
        next();
    }
}

module.exports = { auth }