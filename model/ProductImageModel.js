let {ProductImage} =require ("../schema/productImageSchema");
let joi = require ("joi");
let file= require ("../helper/file");
let {auth} = require ("../middleware/authMiddleware");


//upload image (Api)
async function photoUpload(param,files,userdata){
    //joi validation
    let check = await checkPhotoUpload(param).catch((err)=>{return {error : err}});
    if(!check || (check && check.error)){
    let error = (check && check.error) ? check.error : "please provide product Id";
        return {error , status : 400}
    }
    let not_upload=[];
    let bulkImage=[];
    
    

    for(let i of files){

        let fileDestination = "E:/shadab project recover/public/upload/";
        let fileName = Date.now() + "-" + Math.round(Math.random()*1E9);
        let ext = i.mimetype.split("/").pop();
        let upload = await file.singleFileUpload(fileDestination + fileName + "." + ext,i.buffer).catch((err)=>{return {error : err}});
        if(!upload || (upload && upload.error)){
            not_upload.push({error:upload})
            continue;
        }
        bulkImage.push({
            p_id:param.p_id,
            image_url:fileName
        })
    }

    let images = await ProductImage.bulkCreate(bulkImage).catch((err)=>{return {error : err}});
     if(!images ||(images && images.error) ){
        let error = (images && images.error) ? images.error : "internal server error ";
        return {error, status : 500}
     }   
     

     return {data:"image uploaded"}
     
}
//joi validation upload image (Api)
async function checkPhotoUpload(param){
    let schema = joi.object({
        p_id : joi.number().required()
    })
    let valid = await schema.validateAsync(param,{abortEarly : false}).catch((err)=>{return {error : err}});
     if(!valid || (valid && valid.error)){
        let msg = [];
        for(let i of valid.error.details){
            msg.push(i.message)
        }
        return {error : msg}
     }
     return {data : valid}
}


module.exports = {photoUpload};
