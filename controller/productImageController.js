let {photoUpload, deletePhoto} = require ("../model/ProductImageModel");
let files = require ("../helper/file");



/// product image upload controller
async function productImageUpload (req,res){
    let checkFile = await files.parseFile(req,res,{
        size : 4000*1000,
        ext : /jpg|jpeg|png|avif/,
        field : [{name:"productImage",maxCount:5}]}).catch((err)=>{return {errror : err}});

    if(!checkFile || (checkFile&& checkFile.errror)){
        let error = (checkFile && checkFile.error) ? checkFile.error : "invalid fields"
        return res.status(400).send(error)
    }

    let data = await photoUpload(req.body,req.files.productImage,req.userdata).catch((err)=>{return {error : err}});
     if(! data || (data && data.error)){
        console.log("error on " , data.error)
        let error = (data && data.error) ? data.error : "internal server error";
         return res.status(500).send(error)
     }

     return res.status(200).send({data:data.data})

}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

/// product image delete controller
async function productImageDelete(req,res){
    let data = await deletePhoto(req.body , req.userdata).catch((err)=>{return {error :err}});
     if(! data || (data && data.error)){
        console.log("errororor from conterorller" , data.error)
        let error = (data && data.error) ? data.error : "internal server error ";
        let status = (data && data.status) ? data.status : 500;
        return res.status(status).send({error})
     } 
     return res.status(200).send({data : data.data})
}



module.exports = {productImageUpload , productImageDelete};
