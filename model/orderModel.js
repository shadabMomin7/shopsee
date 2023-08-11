let {Order} = require("../schema/orderSchema");
let {Op} = require("sequelize");
let {Products} = require("../schema/productSchema")




async function order(param){
    // parameter validate
    let check = await checkOrder(param).catch((err)=>{return {error :err}});
     if(!check || (check && check.error)){
        let error = (check && check.error) ? check.error : "invalid details on order";
         return {error , status : 400}
     }

     // find product 
     let findProduct = await Products.findAll({where :{id :{[Op.in] : param.product_id}}}).catch((err)=>{return {error : err}});
     if(!findProduct || (findProduct && findProduct.error)){
        let error = (findProduct && findProduct.error ) ? findProduct.error : "Products not found";
         return {error , status : 404}
      }

      // count of product 
      let countProduct = await Products.count({where : {id : findProduct.id}}).catch((err)=>{return {error : err}});
       if(!countProduct || (countProduct && countProduct.error)){
        
       }



}


// joi validation 
async function checkOrder(param){
    let schema = joi.object({
                              product_id : joi.array().required(),
                              user_id : joi.number().required(),
                              address : joi.string().min(5).max(70).required(),
                              contact : joi.number().required(),
                              email : joi.string().required(),
                              payment_mode : joi.number().required(),
                              payment_channel : joi.number(),


   })
  
 let valid = await schema.validateAsync(param, {abortEarly : false}).catch((err)=>{return {error : err}});
  if(!valid || (valid && valid.error)){
    let msg = [];
     for(let i of valid.error.details){
        msg.push(i.message)
     }
     return {error : msg}
  }  
  return {data : valid.data}
}

