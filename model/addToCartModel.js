let {AddToCart} = require ("../schema/addToCartSchema");
let joi = require ("joi");
let {Products} = require ("../schema/productSchema");
const { update } = require("./productModel");




//// add To Cart (Api)
async function addToCart(param,userdata){
    // joi validation
    let check = await checkAddToCart(param).catch((err)=>{return {error : err}});
     if(!check || (check && check.error)){
        let error = (check && check.error) ? check.error : "invalid details";
        return {error, status : 400}
     }

    /// find product on db
     let find = await Products.findOne({where : {id : param.product_id}} , {raw : true}).catch((err)=>{return {error : err}});
      if(!find || (find && find.error)){
        let error = (find && find.error) ? find.error : "product not found";
        return {error, status :404 }
      }

    //checking stocks is available or not
     if(find.stocks < param.quantity){
      return {error : `this product is ${find.name} Out of stock` , status : 416}
    } 
    // check if user added product already on cart
    let cart = await AddToCart.findOne({where : {user_id : userdata.id , product_id : param.product_id  } , raw : true}).catch((err)=>{return {error : err}});
     if(cart && cart.error){
      let error = (cart && cart.error) ? cart.error : "error on finding user Id | internal server error";
      return { error , status : 404}
     }
    // if user added product on cart then update
     if(cart){
        let update = await AddToCart.update({product_id :cart.product_id,user_id : userdata.id, quantity : param.quantity} , {where : {id : cart.id}})
                                                                        .catch((err)=>{return {error : err}});
        if(!update || (update && update.error)){
          let error = (update && update.error) ? update.error : "error on updating on add to cart | try again | internal server error"
          return {error , status : 500}
        }                           
     }else {    
   // else add on  Add to cart
    param["user_id"] = userdata.id
    let create = await AddToCart.create(param).catch((err)=>{return {error : err}});
    if(!create || (create && create.error )){
     let error = (create && create.error) ? create.error : " error on adding on add to cart | try again | Internal server error ";
     return {error ,status : 500}
    }
  }
  return {data : "product added to cart"}
       
}
////// add to cart  joi validation/////////////////
async function checkAddToCart(param){
    let schema = joi.object({
                             product_id : joi.number().required(),
                             quantity : joi.number().required()

    })

    let valid = await schema.validateAsync(param,{abortEarly : false}).catch((err)=>{return {error :err }});
     if(!valid || (valid && valid.error)){
        let msg = [];
        for(let i of valid.error.details){
            msg.push(i.message)
        }
        return {error : msg}
     }
     return {data : valid}

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// remove from add to card (api)

async function removeCart(param ,userdata){
  let check = await checkRemoveCart(param).catch((err)=>{return {error : err}});
   if(!check || (check && check.error)){
    let error = (check && check.error) ? check.error : "Insert valid product Id to remove";
    return {error ,status : 400}
   }
  
   let remove = await AddToCart.destroy({where : {product_id : param.productId , user_id : userdata.id}}).catch((err)=>{return{error:err}});
    if(!remove || (remove && remove.error)){
      let error = (remove && remove.error) ? remove.error : "this product not found to remove from cart";
      return {error , status : 404}
    }
    return { data : "product remove from cart" }
}

async function checkRemoveCart(param){
  let schema = joi.object({
                            productId : joi.number().required()
  })

  let valid = await schema.validateAsync(param,{abortEarly : false}).catch((err)=>{return {error : err}});
   if(!valid || (valid && valid.error)){
    let msg = []
    for(let i of valid.error.details){
      msg.push(i.message)
    }
    return {error : msg}
   }
   return { data : valid.data}

}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// view add to cart (view cart api)

async function viewCart(param){

  let check = await checkViewCart(param).catch((err)=>{return {error : err}});
   if(!check || (check && check.error)){
    let error = (check && check.error) ? check.error : "invalid user Id | provide valid user ID";
    return {error , status : 400 }
   }
 
   let findUser = await AddToCart.findOne({where : {user_id : param.UserId}}).catch((err)=>{return {error : err}});
   if(!findUser || (findUser && findUser.error)){
    let error = (findUser && findUser.error) ? findUser.error : "can't find product on cart";
    return {error , status : 404}
   }
    return {data : findUser , status : 200}
}

/////// joi validation   view cart (Api)   /////////
async function checkViewCart(param){
  let schema = joi.object({
                             UserId : joi.number().required()
  })

  let valid = await schema.validateAsync(param,{abortEarly : false}).catch((err)=>{return {error : err}});
   if(!valid || (valid && valid.error)){
    let msg = []
    for(let i of valid.error.details){
      msg.push(i.message)
    }
    return {error : msg}
   }
   return {data : valid.data}
}

module.exports = {addToCart, removeCart,viewCart}
