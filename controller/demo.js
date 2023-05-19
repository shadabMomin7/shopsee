let file = require ("../helper/file");

async function  uploadFile(req,res){
    let checkFile = await file.parseFile(req,res,{
                 size : 4000*1000,
                 ext : /jpg|jpeg|png/,
                 field : "profile"
    }).catch((err)=>{return {errror : err}});

    if(!checkFile || (checkFile&& checkFile.errror)){
        
        return res.status(400).send({error : "invalid fileds"})
    }

    let fileName = "E:/shadab project recover/public/upload/" + Date.now() + "-" + Math.round(Math.random()* 1E9);

    if(!req.body.name || req.body.name != "abc"){
        return res.status(400).send({error : "fields name not matched"})
    }

    // let file = [{buffer:"esrdtfygubhnkcjdskb"},{buffer:"esrdtfygubhnkcjdskb"},{buffer:"esrdtfygubhnkcjdskb"}]
    // let not_upload=[];
    // let bulkImage = [];
    // for(let i of file){
    //     let  check = await file.singleFileUpload(fileName , req.file.buffer).catch((err)=>{return {error : err}});
    //     if(){
    //         not_upload.push();
    //         continue
    //     }
    //     bulkImage.push({
    //         pid:,
    //         image:,
    //         create_by:userdata.id
    //     })
    // }


    let upload = await file.singleFileUpload(fileName , req.file.buffer).catch((err)=>{return {error : err}});
     if(!upload || (upload && upload.error)){
        console.log("error",upload)
        return res.status(500).send({error : "internal server error"})
     }
     return res.status(200).send({data : "file uploaded successfully"})

  
}

module.exports = {uploadFile}