let { User } = require("../schema/userSchema");
let joi = require("joi");
let bcrypt = require('bcrypt');
let { User_permission } = require("../schema/UserPermissionSchema")
let { encrypt } = require("../helper/securityHelper")
let { gmail } = require("../helper/mailer");
// let randomstring = require("randomstring");
const { where } = require("sequelize");
let Otp = require ("otp-generator");





// registratation (APi)

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
       let error = (param.password && param.password.error) ? param.password.error : "please try again. Internal server error";
        return {error , status : 500}
    }
    // register user on db
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
            return { error: "internal server error" , status : 500 }
        }
        let error = (user_permission && user_permission.error) ? user_permission.error : "permission denied";
        return {error , status : 401}
    }

    // return success
    return { data:"your registration successfully", user }
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
    let token = await encrypt({ id: user.id },"shadab@123").catch((err) => { return { error: err }});

    if (!token || (token && token.errror)) {

        return { error: "error in token" }
    }
    // give token to user and update on db
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

//function for forget password (APi)

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
    let otp = Otp.generate(6,{upperCaseAlphabets:false , lowerCaseAlphabets : false ,specialChars : false});
    //otp encryption
    let encryptedOTP = await bcrypt.hash(otp, 10).catch((err) => {
        return { error: err }
    });
    if (!encryptedOTP || (encryptedOTP && encryptedOTP.error)) {
        return { error: "error in otp" }
    }
    // encrypted otp save on db 
    user.otp = encryptedOTP

    let result = await user.save().catch((err) => {
        return { error: err }
    });
    // let result = await User.update({otp:otp},{where:{id:user.id}})

    if (!result || (result && result.error)) {
        return { error: "otp not save" }
    }
   
    // mailer path 

    let mailoption = {
        from: "mominshadab533@gmail.com",
        to: user.email,
        subject: "Forgot Password",
        text: `your OTP is ${otp} for forgot password`
    }

    //send mail 
    let sendmail = await gmail(mailoption).catch((err) => {
        return { error: err }
    });

    if (!sendmail || (sendmail && sendmail.error)) {
        return { error: sendmail }
    }
    
    //resturn success
    return { data: sendmail }
}

//joi validation .(forget password)
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//resetPassword (APi)
async function resetPassword(param) {
    //joi validation
    let check = await verifyPassword(param).catch((err) => {
        return { error: err }
    });
    if (!check || (check && check.error)) {
        return { error: check.error }
    }
    
    //checking user by email id
    let user = await User.findOne({ where: { email: param.email } }).catch((err) => {
        return { error: err }
    });
    if (!user || (user && user.error)) {
        return { error: "email id not registered" }
    }
    
    // checking otp correct or not
    let compare = await bcrypt.compare(param.otp.toString(),user.otp).catch((err) => {
        return { error: err }
    });
    if (!compare || (compare && compare.error)) {
        
        return { error: "invalid otp " }
    }
    
    // password encryption and saving password
    param.password = await bcrypt.hash(param.password, 10).catch((err) => {
        return { error: err }
    });
    if (!param.password || (param.password && param.password.error)) {
        return { error: param.password.error }
    }
    
    // new password updating on db and update otp value null
    let updatePassword = await User.update({ password: param.password, otp: "" }, { where: { otp: param.otp } }).catch((err) => {
        return { error: err }
    });

    if (!updatePassword || (updatePassword && updatePassword.error)) {
        return { error: "error on updating password" }
    }
    //return success
    return { data: "password reset successfully" }

}
//joi validation .(reset password)
async function verifyPassword(param) {
    let schema = joi.object({
        email : joi.string().required(),
        otp: joi.number().min(6).required(),
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