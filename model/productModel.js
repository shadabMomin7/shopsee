let joi = require("joi");
const { Products } = require("../schema/productSchema");
const { where, Op, json, NUMBER } = require("sequelize");
const { Category } = require("../schema/categorySchema");
const { Product_category } = require("../schema/productCategorySchema");
const { raw } = require("mysql2");


// add product (APi)
async function add(param, userdata) {
    //joi validation
    let check = await addproduct(param).catch((err) => {return { error: err }});
    if (!check || (check && check.error)) {
        let error = (check && check.error) ? check.error : "fill proper details to add product";
        return { error, status: 400 }
    }
    /// checking product already on db or not
    let slug_verify = await Products.findOne({ where: { slug: param.slug }, raw: true }).catch((err) => {return { error: err }});
     if (slug_verify) {
        let error = (slug_verify && slug_verify.error) ? slug_verify.error : " this product is already added";
        return { error, status: 400 }
    }
    // check if gst not get from user then bydefault 5% faster
    if(!param.gst || param.gst <= 0 || param.gst > 28 || param.gst < 5){
        param["Gst"] = 5
        param["gst_on_base_price"] = param.price*param.Gst/100;
    }
    // if gst get from user then 
    if(param.gst ){
        param["Gst"] = param.gst
        param["gst_on_base_price"] = param.price*param.Gst/100;
    }

    // dicountType and discount price not get from user
    if(!param.discount_type || param.discount_type <= 0 || param.discount_type > 2 || !param.discount_price){

        param["base_price_with_gst"] = param.price + param.gst_on_base_price;
        param["final_gst"] = param.gst_on_base_price;
        param["total_amount"] = Math.round(param.base_price_with_gst);
    }
    // formating discount and percentage
    param["base_price"] = param.price
     if (param.discount_type == 1) {
        // discountType  amount =1
        param["discount_price"] = param.discount
         param["price_after_discount"] = param.base_price -param.discount ;
         param["base_price_with_gst"] = Math.round(param.base_price + param.gst_on_base_price);
         param["gst_on_discount"] = param.discount*param.Gst/100;
         param["discount_with_gst"] = param.discount + param.gst_on_discount;
         param["final_gst"] = param.gst_on_base_price - param.gst_on_discount;
         param["total_amount"] = Math.round(param.price_after_discount + param.final_gst) ;

     }
     if (param.discount_type == 2) {
        // discountType  percentage = 2
        let percentage =  param.base_price*param.discount/100;
        param["price_after_discount"] = param.base_price - percentage;

        param["base_price_with_gst"] = Math.round(param.base_price + param.gst_on_base_price);
        param["gst_on_discount"] = percentage*param.Gst/100;
        param["discount_price"] = param.price * param.discount /100;
        param["discount_percentage"] = param.discount
        param["discount_with_gst"] = param.discount_price + param.gst_on_discount;
        param["final_gst"] = param.gst_on_base_price - param.gst_on_discount;
        param["total_amount"] = Math.round(param.price_after_discount + param.final_gst) ;

     }

    // fromating who created product and who updated;
    param["created_by"] = userdata.id
    param["updated_by"] = userdata.id 


    // convert details datatype to string
    param.details =  JSON.stringify(param.details)
     
    // add product on db
    let product = await Products.create(param).catch((err) => { return { error: err }});
    if (!product || (product && product.error)) {
        let error = ( product && product.error) ? product.error : "internal server error | try again";
        return { error, status: 500 }
    }
    // check category type , if category type is not Array then return
    if (typeof (param.category) !== "object" || !Array.isArray(param.category)|| !param.category || param.category.length <= 0) {
        return {data :{data: product ,reminderMessage : "successfully Product added but category not assigned for this product"} }
    }
    // checking category on db / if not find there then return
    if(param.category){
    let cat_list = param.category
    let cat = await Category.findAll({ where: { id: { [Op.in]:cat_list } } }).catch((err) => {return { error: err }});
    if (!cat || (cat && cat.error)) {
        let error = (cat && cat.error) ? cat.error : "cannot find this category to assign ";
        return { data:{data: product , msg:"cannot find this category to assing" ,error} }
    }
    //  fromating for category assign and who create and who update product to category assign
    let product_cat = [];
    for (let record of cat) {
        product_cat.push({ product_id: product.id, category_id: record.id , created_by : userdata.id , updated_by : userdata.id});
    }
    /// add bulk product with category in db on third table
    let p_cat = await Product_category.bulkCreate(product_cat).catch((err) => {return { error: err }});
    if (!p_cat || (p_cat && p_cat.error || p_cat.length <=0 )) {
        let error = ( p_cat && p_cat.error) ? p_cat.error : " Category ID not found";
         return { data:{data:product,msg:"category not assigned " , error}}
    }
    /// return success 
    return {data:{ data: product, p_cat}};
   }
  // return data object
  return {data : data}
}
/// add product joi validation
async function addproduct(param) {
    let schema = joi.object({
        name: joi.string().min(4).max(150).required(),

        price: joi.number().min(1).required(),

        discription: joi.string().max(110).required(),

        details: joi.object({
            ProductDetails: joi.string().min(10).max(250).required(),
            size: joi.string().required(),
            colour: joi.string().required(),
            material: joi.string().min(5).max(150).required()
        }),
        gst : joi.number().allow(null),

        slug : joi.string().max(100).required(),

        stocks: joi.number().min(1).required(),

        stocks_alert: joi.string().required(),

        discount_type : joi.number().allow(null), 

        discount: joi.number().allow(null),

        is_active: joi.boolean(),

        category: joi.array().allow(null),   
    });

    let valid = await schema.validateAsync(param, { abortEarly: false }).catch((err) => { return { error: err }});
    if (!valid || (valid && valid.error)) {
        let msg = [];
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid.data }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//update product (APi)

async function update(param, userdata) {
    //joi validation 
    let check = await updateproduct(param).catch((err) => {return { error: err }});
    if (!check || (check && check.error)) {
        let error = (check && check.error) ? check.error : "provide proper details";
        return { error, status: 401 }
    }
    // check product is there or not on database
    let product = await Products.findOne({ where: { id: param.ProductId }} , {raw : true}).catch((err) => {return { error: err }});
    if (!product || (product && product.error)) {
        let error = (product && product.error) ? product.error : "  product not found to update"; 
        return { error, status: 401 }
    }  
    /// check slug is same or not from database
      let checkSlug = await Products.findOne({where : {slug : param.slugs}} , {raw :true}).catch((err)=>{return {error : err}});
      if(checkSlug || checkSlug === param.slug) {
        let error = "please enter different slug for this product while your are updating";
         return {error , status : 400 }
      }
       // check if gst not get from user then bydefault 5% faster
    if(!param.gst || param.gst <= 0 || param.gst > 28 || param.gst < 5){
        param["Gst"] = 5
        param["gst_on_base_price"] = param.price*param.Gst/100;
    }
    // if gst get from user then 
    if(param.gst ){
        param["Gst"] = param.gst
        param["gst_on_base_price"] = param.price*param.Gst/100;
    }

    // dicountType and discount price not get from user
    if(!param.discount_type || param.discount_type <= 0 || param.discount_type > 2 || !param.discount_price){

        param["base_price_with_gst"] = param.price + param.gst_on_base_price;
        param["final_gst"] = param.gst_on_base_price;
        param["total_amount"] = Math.round(param.base_price_with_gst);
    }
    // formating discount and percentage
    param["base_price"] = param.price
     if (param.discount_type == 1) {
        // discountType  amount =1
        param["discount_price"] = param.discount
         param["price_after_discount"] = param.base_price -param.discount ;
         param["base_price_with_gst"] = Math.round(param.base_price + param.gst_on_base_price);
         param["gst_on_discount"] = param.discount*param.Gst/100;
         param["discount_with_gst"] = param.discount + param.gst_on_discount;
         param["final_gst"] = param.gst_on_base_price - param.gst_on_discount;
         param["total_amount"] = Math.round(param.price_after_discount + param.final_gst) ;

     }
     if (param.discount_type == 2) {
        // discountType  percentage = 2
        let percentage =  param.base_price*param.discount/100;
        param["price_after_discount"] = param.base_price - percentage;

        param["base_price_with_gst"] = Math.round(param.base_price + param.gst_on_base_price);
        param["gst_on_discount"] = percentage*param.Gst/100;
        param["discount_price"] = param.price * param.discount /100;
        param["discount_percentage"] = param.discount
        param["discount_with_gst"] = param.discount_price + param.gst_on_discount;
        param["final_gst"] = param.gst_on_base_price - param.gst_on_discount;
        param["total_amount"] = Math.round(param.price_after_discount + param.final_gst) ;

     }
     /// convert details datatype to string
    param.details =  JSON.stringify(param.details)
      
    //who updated and when updated
    param["updated_by"] = userdata.id
    param["updatedAt"] = Date.now()

    // update product on database
    let update = await Products.update(param, { where: { id: product.id } }).catch((err) => { return { error: err }});
    if (!update || (update && update.error)) {
        let error = (update && update.error) ? update.error : "error while updating | internal server error";
        return { error, status: 500 }
    }
    //return success
    return { data: "product updated successfully", status: 200 }
}
// joi validation function for update product
async function updateproduct(param) {
    let schema = joi.object({
        ProductId: joi.number().required(),
        name: joi.string().min(3).max(100).required(),
        price: joi.number().min(1).required(),
        discription: joi.string().required(),
        slugs: joi.string().min(5).max(70).required(),
        gst : joi.number().allow(""),
        details: joi.object({
                             ProductDetails : joi.string().min(5).max(250).required(),
                              size : joi.string().required(),
                              colour: joi.string().required(),
                            material: joi.string().min(5).required()
        }).required(),
        stocks: joi.number().min(1).required(),
        stocks_alert: joi.string().required(),
        discount_type: joi.number().allow(null),
        discount : joi.number().allow(null),
        is_delete: joi.boolean(),
        is_active: joi.boolean()

    });

    let valid = await schema.validateAsync(param, { abortEarly: false }).catch((err) => {return { error: err }});
    if (!valid || (valid && valid.error)) {
        let msg = [];
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid.data }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//assign product category (APi)

async function assignCategory(param ,userdata) {
//joi validation
    let check = await assignCategoryCheck(param).catch((err) => {return { error: err }});
    if (!check || (check && check.error)) {
        let error =  (check && check.error) ? check.error : "please provide a valid category ID and product ID"
        return { error, status: 400 }
    }
// find product is there on DB or not
    let product = await Products.findOne({ where: { id: param.product_id}, raw : true }).catch((err) => {return { error: err }});
    if (!product || (product && product.error)) {
        let error =  (product && product.error) ? product.error : "this product ID not found";
        return { error, status: 404}
    }
/// find category on db / if not find then return
    let productCatgeory = []
    let cat_Id = param.category;
    if(param.category){
        let categoryFind = await Category.findAll({where : {id :{[Op.in] : cat_Id} }}).catch((err)=>{return {error : err}});
         if(!categoryFind || (categoryFind && categoryFind.error ) || categoryFind.length<=0){
            let error = (categoryFind && categoryFind.error) ? categoryFind.error : "this category Id not found";
            return {error, status : 404}
         }    
//  listing product to category 
    for (let record of categoryFind) {
        productCatgeory.push({ product_id: product.id, category_id: record.id ,created_by:userdata.id,updated_by:userdata.id ,updatedAt:Date.now()})
    }
}
//delete previous product data
    let del = await Product_category.destroy({ where: { product_id : product.id} }).catch((err) => {return { error: err }});
    if (del && del.error) {
        let error = (del && del.eror) ? del.eror : "Old product data not deleted | can't assign category | try again";
        return { error, status : 500}
    }
// assign new product to category
    let prod_cat = await Product_category.bulkCreate(productCatgeory).catch((err) => {return { error: err }});
    if (!prod_cat || (prod_cat && prod_cat.error)) {
        let error = (prod_cat && prod_cat.error) ? prod_cat.error : "error on adding category| try again  | internal sever error ";
        return { error, status: 500 }
    }
    return { data: prod_cat }
}
//joi validation assign Category (Api)
async function assignCategoryCheck(param) {
    let schema = joi.object({
        product_id: joi.number().required(),
        category: joi.array().required()
    });

    let valid = await schema.validateAsync(param, { abortEarly: false }).catch((err) => {
        return { error: err }
    });
    if (!valid || (valid && valid.error)) {
        let msg = [];
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid.data }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

// view all product (APi)

async function viewAllProduct(param){
    //joi validation    
    let check = await checkViewProduct(param).catch((err)=>{return {error : err}});
     if(!check || (check && check.error)){
        let error = (check && check.error) ? check.error : "please provide proper data";
         return {error, status : 400}
     }
    // formating parameters
     let where = {};
     if(param.productName){
        where["name"] = {[Op.like] : `%${param.productName}%`}
     } 
     if(param.amountGreaterThen){
        where["base_price_with_gst"] =  {[Op.gt] : param.amountGreaterThen}
     }
     if(param.amountLessThen){
        where["base_price_with_gst"] = {[Op.lt] : param.amountLessThen}
     }
     // pagination fromat
     let record = (param.record) ? param.record : 10;
     let page = (param.page) ? param.page : 1;
     let offset = record *(page-1);

     // counting total data
     let count = await Products.count({where : where}).catch((err)=>{return {error :err}});
      if(!count || (count && count.error)){
        let error = (count && count.error) ? count.error : "unable to find this products || try some different ";
         return {error,status : 500}
      }
     /// find all data 
      let findProduct = await Products.findAll( { where : where , limit : record , offset : offset}).catch((error)=>{return {error}});
       if(! findProduct || (findProduct && findProduct.error)){
        let error = (findProduct && findProduct.error) ? findProduct.error : "internal server error | product not found";
         return {error , status : 500}
       }
    // create res to return 
       let res = { data : findProduct , total : count , page : page , record : record};
    // retrun success res
       return res
      
}

//joi validation of view All products
async function checkViewProduct(param) {
    let schema = joi.object({
        productName: joi.string().allow(""),
        amountGreaterThen : joi.number().allow(""),
        amountLessThen :joi.number().allow(""),
        page : joi.number().allow(""),
        discount_type : joi.string().allow("")

});
    let valid = await schema.validateAsync(param, { abortEarly: false }).catch((err) => {return { error: err }});
    if (!valid || (valid && valid.error)) {
        let msg = [];
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid.data }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// delete and restore products (soft delete)
 async function DAndR(ID,userdata , DeleteDecision,ActiveDecision){
    // joi validation
     let check = await checkDAndR(ID).catch((err)=>{return {error : err}});
      if(!check || (check && check.error)){
        let error = (check && check.error) ? check.error : "please provide valid product ID";
         return {error , status : 400}
      }
    // check product on DB
     let findProductID = await Products.findOne({where : {id : ID.product_id}}).catch((err)=>{return {error : err}});
      if(!findProductID || (findProductID && findProductID.error)){
        let error = (findProductID && findProductID.error) ? findProductID.error : "can't find this product to delete product";
         return {error , status : 404}
      }
    // (soft delete) product
    let deleteProduct = await Products.update({is_deleted : DeleteDecision ,is_active : ActiveDecision, updated_by : userdata.id} ,{where : {id : findProductID.id}})
                                                                                  .catch((err)=>{return {error : err}});
    if(!deleteProduct || (deleteProduct && deleteProduct.error)){
        let error = (deleteProduct && deleteProduct.error) ? deleteProduct.error : "can't delete | try again";
        return {error , status : 500}                                                                              
    }
    return { data : deleteProduct}
 }

//// joi validation
async function checkDAndR (ID){
    let schema = joi.object({
                             product_id : joi.number().required()
 
    })
    let valid = await schema.validateAsync(ID, { abortEarly: false }).catch((err)=>{return {error : err}});
     if(!valid||(valid && valid.error )){
        let msg = [];
        for(let i of valid.error.details){
            msg.push(i.message)
        }
        return {error : msg}
     }
     return {data : valid.data}

} 
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// view single product

async function viewSingleProduct(param){
    // joi validation
    let check = await checkViewSingleProduct(param).catch((err)=>{return {error : err}});
     if(!check || (check && check.error)){
        let error = (check && check.error) ? check.error : "invalid product Name";
        return { error , status : 400}
     }
    // formating parameter
    let find = await Products.findOne({where : { name :{[Op.like] :`${param.ProductName}%`}}}).catch((err)=>{return {error :err}});
     if(!find || (find && find.error)){
        let error = (find && find.error)? find.error : "Can't find this product";
        return {error, status : 404}

     }
     return { data : find}
}


async function checkViewSingleProduct(param){
    let schema = joi.object({
                              ProductName : joi.string().min(1).required()
    })

    let valid = await schema.validateAsync(param, { abortEarly: false }).catch((err)=>{return {error : err}});
    if(!valid || (valid && valid.error)){
        let msg = [];
        for(let i of valid.error.details){
            msg.push(i.message)
        }
        return {error : msg}
    }
    return {data : valid.data}
}

module.exports = { add, update ,assignCategory,viewAllProduct,DAndR ,viewSingleProduct};



// if (param.discount_type === "amount") {
//     param.discount_type = 1
//     param[""] = param.discount - param.price
// }


// if (param.discount_type === "percentage") {
//     param.discount_type = 0
//     let amount = param.price * param.discount / 100

//     param["price_after_discount"] = param.price - amount

// }