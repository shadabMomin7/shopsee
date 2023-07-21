let { User } = require("../schema/userSchema");
let joi = require("joi");
let bcrypt = require('bcrypt');
let { User_permission } = require("../schema/UserPermissionSchema")
let { encrypt } = require("../helper/securityHelper")
let { gmail } = require("../helper/mailer");
// let randomstring = require("randomstring");
const { where } = require("sequelize");
let Otp = require ("otp-generator");
let {logger} = require ("../helper/log");






// registratation (APi)

async function Register(param) {
    //joi validation 
    let check = await checkRegister(param).catch((err) => {return { error: err }});

    if (!check || (check && check.error)) {
        let error = (check && check.error) ? check.error : "please enter a valid details";
        return { error , status : 400 }
    }
   
    //check email id already reistered or not 
    let find = await User.findOne({ where: { email: param.email },raw:true }).catch((err) => {return { error: err }});
    console.log("find",find)
    if (find ) {
        logger("error",`Register -Error: User not createdbjk, Error:${find}`,find)
        return { error :"this email is already registered", status : 409}
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
        let error = (user && user.error)? user.error : " user not registered |internal server error";
        logger("error",`Register -Error: User not created, Error:${error}`)
        return {error, status : 500}
    }
    // user ko user permission dere h 
    let user_permission = await User_permission.create({ user_id: user.id, permission_id: 1 }).catch((err) => {return { error: err }});

    if (!user_permission || (user_permission && user_permission.error)) {
      
        // user permission nhi mili to delete kaare h 
        let del = await User.destroy({ where: { id: user.id } }).catch((err) => { return { error: err }});
        if (del.error) {
            let error = (del.error)? del.error : "user not deleted | internal server error | contact with admin  (admin contact no : )";
            logger("error",`Register -Error: Permission not deleted, User: ${user.id} error: ${error}`)
            return { error , status : 500 }
        }
        let error = (user_permission && user_permission.error) ? user_permission.error : "not getting user permission | internal server error";
        return {error , status : 500}
    }
    //  let reason = "Thank You , You've  Been Added To Our Mailing List And Will Now Be Among The First To Hear About New Arrivals, Big Events And Special Offers" ;
    //  mailoption = {
    //                from : "shadabprogrammer@gmail.com",
    //                to : user.email ,
    //                sub : "welcome to shopsee.com",
    //                text : ""
    //  }
    
    // return success
    return { data:"your registration successfully", user , status : 200 }
}

//joi validation .(register)
async function checkRegister(param) {
    let schema = joi.object({

        name: joi.string().min(4).max(55).required(),
        email: joi.string().min(15).max(65).required(),
        password: joi.string().min(8).max(15).required()
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
        let error = (valid && valid.error)? valid.error : "provide valid Email Id and Password";
        return { error , status : 400 }
    }
     //checking email id 
    let user = await User.findOne({ where: { email: param.email } }).catch((err) => {return { error: err }});
    if (!user || (user && user.error)) {
        let error = (user && user.error)? user.error : "Invalid email ID";
        return { error , status : 404 }
    }
    // checking password
    let compare = await bcrypt.compare(param.password, user.password).catch((err) => {return { error: err }});
    if (!compare || (compare && compare.error)) {
       let error = (compare && compare.error)? compare.error : "wrong password";

        return { error , status : 401 }
    }
     // generate token 
    let token = await encrypt({ id: user.id },"shadab@123").catch((err) => { return { error: err }});

    if (!token || (token && token.errror)) {
        let error = (token && token.error) ? token.error : "error in token encryption | try again | internal server error";
        return { error , status : 500 }
    }
    // give token to user and update on db
    let updatedUser = await User.update({ token: token }, { where: { id: user.id } }).catch((err => { return { error: err } }));

    if (!updatedUser || (updatedUser && updatedUser.error)) {
        let error = (updatedUser && updatedUser.error) ? updatedUser.error : "error in token updated | internal server error";
        logger("error",`Database Error: ${error}`)
        return { error , status : 500 }
    }
     // login success
    return { data: "logging success", token: token , status : 200}
}

//joi validation.(login)
async function checkLogin(param) {
    let schema = joi.object({
        email: joi.string().min(5).max(100).required(),
        password: joi.string().min(8).max(15).required(),
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    let updatePassword = await User.update({ password: param.password, otp: null }, { where: { id : user.id} }).catch((err) => {
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///change password (APi)
async function changePassword(param,userData){
    // joi validation
    let check = await checkChangePassword(param).catch((err)=>{return {error : err}});
     if(!check || (check && check.error)){
        let error = (check && check.error) ? check.error : "invalid details | try again ";
         return {error , status :400 }
     }
     
     //// check old password and new pass same or not 
     if(param.password == param.newPassword){
        let error = "this is old password |  set new password";
        return {error , status : 406}
       }
     
       // check user id  registered or not
     console.log("user data",userData)
      let checkUser = await User.findOne({where : {id : userData.id}}).catch((err)=>{return{error : err}});
       if(!checkUser || (checkUser && checkUser.error )){
        let error = (checkUser && checkUser.error) ? checkUser.error : "this user not found";
         return {error , status : 404}
       }
       
       
      // checking old password correct or not
      let compare = await bcrypt.compare(param.password ,checkUser.password).catch((err)=>{return {error : err}});
       if(!compare || compare.error){
        return { error  : "invalid password  | please try again" , status : 401}
       }

       // encrypting new password
      let encrypt = await bcrypt.hash(param.newPassword ,10).catch((err)=>{return {error : err}});
       if(!encrypt || (encrypt && encrypt.error)){
        let error = (encrypt && encrypt.error) ? encrypt.error : "internal server error";
        return{ error , status : 500}
       } 
       // updating new password on db 
       let updateDB = await User.update({password : encrypt},{where : {id : checkUser.id}}).catch((err)=>{return {error : err}});
        if(!updateDB || (updateDB && updateDB.error)){
            let error = (updateDB && updateDB.error) ? updateDB.error : "internal server error , try again ";
            return {error, status : 500}
        }

        return { data : " your password has been changed successfully"}
      
}

///joi validation of change password////////
async function checkChangePassword(param){
    let schema = joi.object({
                               password : joi.string().min(8).max(15).required(),
                               newPassword : joi.string().min(8).max(15).required()
    })
    let valid = await schema.validateAsync(param, {abortEarly : false}).catch((err)=>{return {error : err}});
     if(!valid || (valid && valid.error)){
        let msg = []
        for(let i of valid.error.details){
            msg.push(i.message)
        }
        return {error : msg}
     }
     return {data : valid}
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// logout (Api)

async function logout(Id){

 if(!parseInt(Id)){
    return {error:"invalide user id"}
 }

let findId = await User.findOne({where : {id :Id}}).catch((err)=>{return {error : err}});
  if(! findId  || (findId && findId.error)){
    let error = (findId && findId.error) ? findId.error : "user not found";
     return {error , status : 404}
  }
let tokenDel = await User.update({token : null},{where : {id : findId.id}}).catch((err)=>{return {error : err}});
  if(! tokenDel || (tokenDel && tokenDel.error)){
    let error = (tokenDel && tokenDel.error) ? tokenDel.error : "internal server error ";
    return {error , status : 500}
      }

      return {data : "logged out"}
}


module.exports = { Register, Login, forgetPassword, resetPassword, changePassword,logout}