let addtocart = require ("../model/addToCartModel");
let {logger} = require('../helper/log');


////////////// add to cart controller ///////////////////////////////////////////////////////////////////////////
async function addToCartContro(req,res){
    let data = await addtocart.addToCart(req.body ,req.userdata).catch((err)=>{return {error : err}});
     if(!data || (data && data.error)){
        let error = (data && data.error) ? data.error : "internal server error";
        let status = (data && data.status) ? data.status : 500;
        return res.status(status).send({error})
     }
     return res.status(200).send({data : data.data})
}

///////////////////////// remove from cart controller /////////////////////////////////////////////////////////////////

async function removeCart(req,res){
  let data = await addtocart.removeCart(req.params,req.userdata).catch((err)=>{return {error : err}});
   if(!data || (data && data.error)){
    let error = (data && data.error) ? data.error : "internal server error";
    let status = (data && data.status) ? data.status : 500;

    return res.status(status).send({error}) 
   }
   
   let status = (data && data.status) ? data.status :200;
   res.status(status).send({data : data.data})
}

///////////////////////// View cart controller ////////////////////////////////////////

async function viewCart(req,res){
   let data = await addtocart.viewCart(req.params).catch((err)=>{return {error : err}});
    if(!data ||(data && data.error)){
      let error = (data && data.error) ? data.error : "internal server error";
      let status = (data && data.status) ? data.status : 500;
      return  res.status(status).send({error})
    }
    let status = (data && data.status) ? data.status : 200;
    return res.status(status).send({data : data.data})
}




module.exports = {addToCartContro , removeCart , viewCart}