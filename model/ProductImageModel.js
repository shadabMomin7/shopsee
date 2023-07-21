let {ProductImage} =require ("../schema/productImageSchema");
let joi = require ("joi");
let file= require ("../helper/file");
let {auth} = require ("../middleware/authMiddleware");
let fs = require("fs").promises
let config = require ("config");
let fileDestination = config.get("FilesPath");


//  product image upload(Api)
async function photoUpload(param,files,userdata){
    //joi validation
    let check = await checkPhotoUpload(param).catch((err)=>{return {error : err}});
    if(!check || (check && check.error)){
    let error = (check && check.error) ? check.error : "please provide product Id";
        return {error , status : 400}
    }
    //
    let not_upload=[];
    let bulkImage=[];
    
    for(let i of files){

    
        let fileName = Date.now() + "-" + Math.round(Math.random()*1E9);
        let ext = i.mimetype.split("/").pop();
        let upload = await file.singleFileUpload(fileDestination + fileName + "." + ext,i.buffer).catch((err)=>{return {error : err}});
        if(!upload || (upload && upload.error)){
            not_upload.push({error:upload})
            continue;
        }
        bulkImage.push({
            product_id:param.product_id,
            image_name  :fileName+'.'+ext
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
        product_id : joi.number().required()
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

//product image delete photos Api

async function deletePhoto(param){
    //joi validation
    let check = await checkDeletePhoto(param).catch((err)=>{return {error : err}});
     if(!check || (check && check.error)){
        let error = (check && check.error) ? check.error : "invalid details";
        return {error , status : 400}
     }
     //find product || if not found return 
     let findProduct = await ProductImage.findOne({where : {product_id : param.product_id , id : param.id}}).catch((err)=>{return {error : err}});
     if(!findProduct || findProduct.error){
        return {error : "product image not found" , status : 404}
      }
    // delete files from system 
      let fsUnlink = await fs.unlink(fileDestination + findProduct.image_name).catch((err)=>{return {error : err}});
       if(fsUnlink && fsUnlink.error){
        let error = (fsUnlink && fsUnlink.error) ? fsUnlink.error : "unable to delete photo | internal server error";
         return {error, status : 500}
       }
       // delete from data base
       let removeFromDb = await ProductImage.destroy({where : {id : param.id}}).catch ((err)=>{return {error : err}});
        if(removeFromDb.error){
            return {error : " error on deleting from database | internal server error", status : 500}
        }
        // return deleted msg
        return {data : "product deleted successfully"}
}


///delete photo joi validation/////////
async function checkDeletePhoto(param){
    let schema = joi.object({
                             id : joi.number().required(),
                             product_id: joi.number()
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

module.exports = {photoUpload, deletePhoto};
