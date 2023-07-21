let product = require("../model/productModel");

// add product controller (Api)
async function add(req, res) {
    
    let data = await product.add(req.body, req.userdata).catch((err) => {return { error: err }});
    if (!data || (data && data.error)) {
        console.log(data.error)
        let error = (data && data.error) ? data.error : "internal server error";
        let status = (data && data.status) ? data.status : 500;
        return res.status(status).send({ error });
    }
    let status = (data && data.status) ? data.status : 200;
    return res.status(status).send({ data: data.data })
}
//////////////////////////////////////////////////////////////////////////////////////////
//update product controller (APi)

async function update(req, res) {
    let data = await product.update(req.body, req.userdata).catch((err) => {
        return { error: err }
    });
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "internal server error";
        let status = (data && data.status) ? data.status : 500;     
        return res.status(status).send({ error });
    }
    let status = (data && data.status) ? data.status : 200;
    return res.status(status).send({ data: data.data });
}
//////////////////////////////////////////////////////////////////////////////////////////////////
// assign product controller (APi)

async function assign(req, res) {
    let data = await product.assignCategory(req.body, req.userdata).catch((err) => { return { error: err }});
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "internal server error";
        let status = (data && data.status) ? data.status : 500;
        return res.status(status).send({ error });
    }
    let status = (data && data.status) ? data.status : 200;
    return res.status(status).send({ data: data.data });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// viewAll product controller (Api)

async function viewall(req,res){
    let data = await product.viewAllProduct(req.query).catch((err)=>{return {error : err}});
     if(!data || (data && data.error)){
        let error = (data && data.error) ? data.error : "internal server error";
         let status = (data && data.status) ? data.status : 500;
          return res.status(status).send({error})  
     }
     return res.status(200).send({data : data.data})

}
//////////////////////////////////////////////////////////////////////////////////////////////////////
// delete product controller (Api) (soft delete)
 async function deleteProduct(req,res){
    let data = await product.DAndR(req.body, req.userdata.id , 1 , 0).catch((err)=>{return {error : err}});
     if(!data || (data && data.error)){
        let error = (data && data.error) ? data.error : "internal server error"; 
        let status = (data && data.status) ? data.status : 500;
        return res.status(status).send({error})
     }
     let status = (data && data.status) ? data.status : 200;
      return res.status(status).send({data  : data.data})
 }

 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
 // restore product controller (Api) 
 async function restoreProduct(req,res){
    let data = await product.DAndR(req.body , req.userdata.id , 0, 1).catch((err)=>{return {error : err}});
     if(!data || (data && data.error)){
        let error = (data && data.error) ? data.error : "Internal server error"; 
        let status = (data && data.status) ? data.status : 500;
        return res.status(status).send({error})
     }
     let status = (data && data.status) ? data.status : 200;
     return res.status(status).send({data : data.data})
 }
 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 ///// view product single  controller (Api)

 async function viewProduct(req,res){
    let data = await product.viewSingleProduct(req.params).catch((err)=>{return {error : err}});
     if(!data || (data && data.error)){
        console.log(data.error)
        let error = (data && data.error)? data.error : "internal server error"; 
        let status = (data && data.status)? data.status : 500;
        return res.status(status).send({error})
     }
     return res.status(200).send({data : data.data})
 }

module.exports = { add, update, assign, viewall,deleteProduct,restoreProduct ,viewProduct}