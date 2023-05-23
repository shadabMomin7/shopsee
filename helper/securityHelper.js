let jwt = require("jsonwebtoken");
let bcrypt = require("bcrypt");


//jwt 
//encryption 
function encrypt(data, key) {
    return new Promise((res,rej) => {
        jwt.sign(data, key, (err, data) => {
            if (err) {
                 rej(err) 
                }
            res(data)
        });
    });
}
//decryption
function decrypt(data, key) {
    console.log(key)
    return new Promise((res,rej) => {
        jwt.verify(data,key, (err,data) => {
            if (err) { 
                rej(err) 
            }
            res(data)
        });
    });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//bcrypt

//encryption
async function hash(data,salt=10){
    let encrypt = await bcrypt.hash(data,salt).catch((err)=>{return {error : err}});
     if(!encrypt || (encrypt && encrypt.error)){
        let error = (encrypt && encrypt.error) ? encrypt.error : "error on encryption | Internal server error ";
         return {error , status : 500}

    }
    return {data : encrypt}

}
//comparing 
async function compare(data,encryptData){
    let check = await bcrypt.compare(data,encryptData).catch((err)=>{return {error : err}});
     if(!check || (check && check.error)){
        let error = (check && check.error) ? check.error : "Invalid data, bad request";
         return {error , status : 400}
     }
     return{data : check}
}


module.exports = { encrypt, decrypt,hash,compare };