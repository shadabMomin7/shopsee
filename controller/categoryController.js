let category = require("../model/categoryModel");



// category add controller

async function add(req, res) {
    let data = await category.add(req.body, req.userdata).catch((err) => {
        return { error: err }
    });

    if (!data || (data && data.error)) {
        //  console.log("error from controller" , data.error)
        let error = (data && data.error) ? data.error : "internal server error"
        return res.status(500).send(error);
    }
    return res.send({ data: data.data });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// category update controller 

async function update(req, res) {
    let params = {...req.params,...req.body}
    let data = await category.update(params, req.userdata).catch((err) => {return { error: err }});
    
    if (!data || (data && data.error)) {
        console.log(data.error)
        let error = (data && data.error) ? data.error : "internal server error";
        return res.status(500).send({ error: error });
    }
    return res.send({ data: data.data });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  category viewAll controller 

async function viewall(req, res) {
    let data = await category.viewall(req.query, req.userdata).catch((err) => {
        return { error: err }
    });

    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "internal server error";
        return res.status(500).send({ error: error });;
    }
    return res.send({ data: data })
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// delete category controller (soft delete)

async function del(req,res){
    let data = await category.dAndR(req.params,req.userdata,1).catch((err)=>{return {error : err}});
     if(! data || (data && data.error)){
        let error = (data && data.error) ? data.error : "internal server error";
        let status = (data && data.status) ? data.status : 500;
         return res.status(status).send({error})
     }
     return res.status(200).send({data : data.data})
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// restor category controller 

async function restore(req,res){
    let data = await category.dAndR(req.params,req.userdata,0).catch((err)=>{return {error : err}});
     if(!data ||(data && data.error)){
        let error = (data && data.error) ? data.error : "internal server error";
        let status = (data & data.status) ? data.status : 500;
         return res.status(status).send({error})
     }
     return res.status(200).send({data : data.data})
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// view category  controller

async function viewController(req,res){
    let data = await category.view(req.params,req.userdata).catch((err)=>{return {error : err}});
     if(!data || (data && data.error)){
        console.log(data.error)
        let error = (data && data.error) ? data.error : "internal server error";
        let status = (data && data.status) ? data.status : 500;
        return res.status(status).send({error})
     }
     return res.status(200).send({data : data.data})
}

module.exports = { add, update, viewall,del,restore , viewController}