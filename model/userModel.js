let { User } = require("../schema/userSchema");
let joi = require("joi");
let bcrypt = require('bcrypt');
let { User_permission } = require("../schema/UserPermissionSchema")
let { encrypt } = require("../helper/securityHelper")
let { gmail } = require("../helper/mailer");
let randomstring = require("randomstring");
const { where } = require("sequelize");



//function for resgitration

async function Register(param) {
    //joi validation 
    let check = await checkRegister(param).catch((err) => {return { error: err }});

    if (!check || (check && check.error)) {
        return { error: check.error }
    }
   
    //check email id already reistered or not 
    let find = await User.findOne({ where: { email: param.email } }).catch((err) => {return { error: err }});
    if (find) {
        return { error: "this email is already registered" }
    }

     //password encryption
     param.password = await bcrypt.hash(param.password, 10).catch((err) => {return { error: err }});

    if (!param.password || (param.password && param.password.error)) {
        return { error: param.password.error }
    }
    // register user
    let user = await User.create(param).catch((err) => {return { error: err }});

    if (!user || (user && user.error)) {
        return { error: "user not created" }
    }
    // user ko user permission dere h 
    let user_permission = await User_permission.create({ user_id: user.id, permission_id: 5 }).catch((err) => {return { error: err }});

    if (!user_permission || (user_permission && user_permission.error)) {
      
        // user permission nhi mili to delete kaare h 
        let del = await User.destroy({ where: { id: user.id } }).catch((err) => {
            return { error: err }
        });
        if (del.error) {
            return { error: "permission denied" }
        }

        return { error: "internal server error" }
    }

    // return success
    return { data: user }
}

//joi validation .(register)
async function checkRegister(param) {
    let schema = joi.object({

        name: joi.string().min(4).max(100).required(),
        email: joi.string().min(6).max(55).required(),
        password: joi.string().min(8).max(150).required()
    });

    let valid = await schema.validateAsync(param, { abortEarly: false }).catch((err) => {return { error: err }});

    if (!valid || (valid && valid.error)) {
        let msg = [];
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid.data }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//function for login.
async function Login(param) {
    //joi validations
    let valid = await checkLogin(param).catch((err) => {return { error: err }});

    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }
     //checking email id 
    let user = await User.findOne({ where: { email: param.email } }).catch((err) => {return { error: err }});
    if (!user || (user && user.error)) {

        return { error: "invalid email id" }
    }
    // checking password
    let compare = await bcrypt.compare(param.password, user.password).catch((err) => {return { error: err }});
    if (!compare || (compare && compare.error)) {
        return { error: "wrong password" }
    }
     // generate token 
    let token = await encrypt({ id: user.id }, "#@#@#").catch((err) => { return { error: err }});

    if (!token || (token && token.errror)) {

        return { error: "error in token" }
    }
    // give token to user
    let updatedUser = await User.update({ token: token }, { where: { id: user.id } }).catch((err => { return { error: err } }));

    if (!updatedUser || (updatedUser && updatedUser.error)) {
        return { error: "internal server error" }
    }
     // login success
    return { data: "logging success", token: token }
}

//joi validation.(login)
async function checkLogin(param) {
    let schema = joi.object({
        email: joi.string().min(5).max(100).required(),
        password: joi.string().min(8).max(150).required(),
    });

    let valid = await schema.validateAsync(param, { abortEarly: false }).catch((err) => {
        return { error: err }
    });
    if (!valid || valid && valid.error) {
        let msg = [];
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid.data }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//function for forget password.

async function forgetPassword(param) {
    //joi validation 
    let check = await verifyEmail(param).catch((err) => {return { error: err }});

    if (!check || (check && check.error)) {
        return { error: check.error }
    }
    //check email id is registered or not
    let user = await User.findOne({ where: { email: param.email } }).catch((err) => {return { error: err }});

    if (!user || (user && user.error)) {
        return { error: "user not found" }
    }
    // otp generate
    let otp = randomstring.generate(6);
    let encryptedOTP = await bcrypt.hash(otp, 10).catch((err) => {
        return { error: err }
    });
    if (!encryptedOTP || (encryptedOTP && encryptedOTP.error)) {
        return { error: "error in otp" }
    }
    user.otp = encryptedOTP

    let result = await user.save().catch((err) => {
        return { error: err }
    });
    // let result = await User.update({otp:otp},{where:{id:user.id}})

    if (!result || (result && result.error)) {
        return { error: "internal server error" }
    }

    let mailoption = {
        from: "shadabmomin533@gmail.com",
        to: user.email,
        subject: "Forgot Password",
        text: `your OTP is ${otp} for forgot password`
    }


    let sendmail = await gmail(mailoption).catch((err) => {
        return { error: err }
    });

    if (!sendmail || (sendmail && sendmail.error)) {
        return { error: sendmail }
    }

    return { data: sendmail }
}
//joifunction verification.(fp)
async function verifyEmail(param) {
    let schema = joi.object({
        email: joi.string().min(4).max(150).required(),
    });

    let valid = await schema.validateAsync(param, { abortEarly: false }).catch((err) => {
        return { error: err }
    });

    if (!valid || (valid && valid.error)) {
        let msg = [];
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid.data }
}
//resetPassword function.
async function resetPassword(param) {
    let check = await verifyPassword(param).catch((err) => {
        return { error: err }
    });
    if (!check || (check && check.error)) {
        return { error: check.error }
    }

    let user = await User.findOne({ where: { email: param.email } }).catch((err) => {
        return { error: err }
    });
    if (!user || (user && user.error)) {
        return { error: "otp is not correct" }
    }

    let compare = await bcrypt.compare(user.otp, param.otp).catch((err) => {
        return { error: err }
    });
    if (!compare || (compare && compare.error)) {
        return { error: compare.error }
    }

    param.password = await bcrypt.hash(param.password, 10).catch((err) => {
        return { error: err }
    });
    if (!param.password || (param.password && param.password.error)) {
        return { error: param.password.error }
    }

    let updatePassword = await User.update({ password: param.password, otp: "" }, { where: { otp: param.otp } }).catch((err) => {
        return { error: err }
    });

    if (!updatePassword || (updatePassword && updatePassword.error)) {
        return { error: "password not matched" }
    }

    return { data: "password reset successfully" }

}
//joifunction verification.(rp)
async function verifyPassword(param) {
    let schema = joi.object({
        otp: joi.string().min(6).required(),
        password: joi.string().min(8).required()
    });

    let valid = await schema.validateAsync(param, { abortEarly: false }).catch((err) => {
        return { error: err }
    });

    if (!valid || (valid && valid.error)) {
        let msg = [];
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid.data }
}

module.exports = { Register, Login, forgetPassword, resetPassword }