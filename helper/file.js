let multer = require ("multer");
let fs = require ("fs").promises

async function parseFile(req,res,options= {}){
    let size = (options.size ) ? options.size : 1000*3;
    let ext = (options.ext) ? options.ext : /jpg|png/ ; 
    let field = (options.field) ? options.field : null;

    if(!field ){
        return { error : "fields are required"}
    }


let upload = multer({
    limits : size,
    fileFilter : function (req,file,cb){
        console.log("file",file)
        let test = ext.test(file.mimetype)
        if(!test){
            return cb({error : "this format is not allowed"})
        }
        cb(null,true)
    }

})

if(typeof (field) == "string"){
    upload = upload.single(field)
}else if(typeof(field) == "object"){
    upload = upload.fields(field)
}else{return {error : "please pass fields"}}

return new Promise ((resolve,reject)=>{
    upload(req,res,(err)=>{
        if(err){
            reject(err)
        }
        resolve(true)
    })
 })
}


async function singleFileUpload(destination , buffer){
    let file = await fs.writeFile(destination,buffer).catch((err)=>{return {error : err}});
     if(file && file.error){
        return {error : file.error}
     }
     return {data : true}

}


module.exports = {parseFile , singleFileUpload};

