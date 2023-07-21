let { Category } = require("../schema/categorySchema");
let joi = require("joi");
let {Op} = require ("sequelize");




//category add (APi)
async function add(param, userdata) {
      //joi validation 
    let validate = await addCategory(param).catch((err) => {return { error: err }});
    if (!validate || (validate && validate.error)) {
        return { error: validate.error , status : 400 }
    }
    //check category id and parent_id is same then return
    if (param.p_id) {
        let cat = await Category.findOne({ where: { id: param.p_id } }).catch((err) =>{return { error: err }});
        if (!cat || (cat && cat.error)) {
            return { error: "category parent id not found"  , status : 404}
        }
    }
    //// check duplicate
    let checkDuplicate = await Category.findOne({where : {name : param.name ,p_id : param.p_id}}).catch((err)=>{return {error : err}});
     if(checkDuplicate){
        return {error : "this is all ready added" , status : 400}
     }
    
    /// update on db who created and who updated
    param["created_by"] = userdata.id
    param["updated_by"] = userdata.id

    // add category on db 
    let create = await Category.create(param).catch((err) => {return { error: err }});
    if (!create || (create && create.error)) {
        return { error: "your category not added,try again | internal server error" , status : 500 }
    }
    // return success category created
    return { data: create ,status : 200 }
}

//joi validations add category 

async function addCategory(param) {
    let schema = joi.object({
        name: joi.string().min(4).max(50).required(),
        p_id: joi.number().required()
    });

    let validate = await schema.validateAsync(param, { abortEarly: false }).catch((err) => {
        return { error: err }
    });
    if (!validate || (validate && validate.error)) {
        let msg = [];
        for (let i of validate.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: validate.data }

}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//update category APi 
async function update(param, userdata) {

    // joi validation (parameters validations)
    let verify = await updateCategory(param).catch((err) => {return { error: err }});
    if (!verify || (verify && verify.error)) {
        let error = (verify && verify.error) ? verify.error : "provide valid category ID to update ";
        return { error , status : 400}
    }
    // check category is there or not on db
        let category = await Category.findOne({ where: { id: param.id } }).catch((err) => {return { error: err }});
        if (!category || (category && category.error)) {
            let error = (category && category.error) ? category.error : "category not found | data not found";
            return { error, status: 404 }
        }
        let categoryName = await Category.findOne({where : {name : param.name}}).catch((err)=>{return {error : err}});
         if(categoryName){
            let error = "please update different category Name ";
            return {error , status : 401}
         }

     // format who update and when update
    // param["created_by"] = userdata.id
    param["updated_by"] = userdata.id
    param["updatedAt"] = Date.now()
  
    //check p_id is 
    if(param.p_id){
        let checkParent = await Category.findOne({where : {id: param.p_id}}).catch((err)=>{return {error : err}});
        if(!checkParent ||checkParent.error){
            let error = "parent Id not found";
            return { error , status : 404}
      }
    //update parent id on db 
      let updateOnDb = await Category.update(param,{where :{id :param.id}}).catch((err)=>{return {error :err}});
             if(!updateOnDb || (updateOnDb && updateOnDb.error)){
                let error = (updateOnDb && updateOnDb.error) ? updateOnDb.error : "parent Id not updated on db| try again";
                 return {error,status : 500}
             } 
       }
    // format who update and when update
    param["updated_by"] = userdata.id 
    param["updatedAt"] = Date.now()
    // update category on db
    if(!param.p_id || param.p_id == 0){
    let update = await Category.update(param, { where: { id: category.id } }).catch((err) => {return { error: err }});
    if (!update || (update && update.error)) {
        let error = (update && update.error) ? update.error : "error while updating , try again";
        return { error, status: 500 }
    }
  }
  
    // return success 
    return { data: "category updated successfully", status: 200 }
}

//joi validation category upated

async function updateCategory(param) {
    let schema = joi.object({
        id: joi.number().min(1).required(),
        name: joi.string().min(4).max(50).required(),
        p_id: joi.number().allow(null)
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

/////////////////////////////////////////////////////////////////////////////////////////////////////
 // view all category APi

async function viewall(param) {
    //joi validation
    let check = await viewCategory(param).catch((err) => {return { error: err }});
    if (!check || (check && check.error)) {
        let error = (check && check.error) ? check.error : "provide proper data";
        return { error, status: 400}
    }
    // formating parameters
    let where = {}
    if (param.id) { where["id"] = param.id }
    if (param.name) { where["name"] =  {[Op.like] : `%${param.name}%`} }
    if (param.p_id) { where["p_id"] = param.p_id }

    // pagination format
    let record = (param.record) ? param.record : 10;
    let page = (param.page) ? param.page : 1;
    let offset = record *(page - 1);

    // check category count details
    let count = await Category.count({ where: where }).catch((err) => {return { error: err }});
    if (!count || (count && count.error)) {
        let error = (count && count.error) ? count.error : "unable to counting category details|Internal server error"
        return { error, status: 500 }
    }
    // find all rows
    let category = await Category.findAll({where: where , limit: record , offset: offset}).catch((err) => {return { error: err }});
    if (!category || (category && category.error)) {
        let error = (category && category.error) ? category.error : "internal server error";
        return { error, status: 500 }
    }
    /// create  all data response 
    let res = {data: category , total: count , page: page , record: record}
    
    // return res success
    return res;
}
//joi validation view category 
async function viewCategory(param) {
    let schema = joi.object({
        id: joi.number(),
        name: joi.string().max(100).allow(""),
        p_id: joi.number(),
        page: joi.number(),
        
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// delete category and restor category (soft delete )
 async function dAndR(param,userdata,decision){
    //joi validation 
    let check = await checkDandR(param).catch((err)=>{return {error : err}});
     if(!check || (check && check.error)){
        let error = (check && check.error) ? check.error : " please provide valid category Id";
        return {error, status : 400}
     }
     //check category id on db 
     let findCatId = await Category.findOne({where : {id : param.id}}).catch((err)=>{return { error : err}});
      if(!findCatId || (findCatId && findCatId.error)){
        let error = (findCatId && findCatId.error) ? findCatId.error : "category Id not found";
         return {error, status : 404}
      }
      // soft delete 
      let update = await Category.update( {is_deleted : decision , updated_by : userdata.id},{where : {id : findCatId.id}}).catch((err)=>{return {error : err}});
       if(!update || (update && update.error)){
        let error = (update && update.error) ?update.error : "internal server error "; 
        return {error , status : 500}
       }
       //return data
       return {data : update}

 }

  ///// joi validation 
  async function checkDandR(param){
    let schema = joi.object({
                              id : joi.number().required()
    })
    let valid = await schema.validateAsync(param,{abortEarly : false}).catch((err)=>{return {error : err}});
     if(!valid || (valid && valid.error)){
        let msg = [];
        for(let i of valid.error.details){
            msg.push(i.message)
        }
        return {error : msg}
     }
     return {data : valid.data}

}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// view (api)

async function view(param){
    let check = await checkView(param).catch((err)=>{return {error : err}});
     if(!check || (check && check.error)){
        let error = (check && check.error) ? check.error : "invalid data";
        return {error , status : 400}
     }
     let find = await Category.findOne({where : {id : param.id}}).catch((err)=>{return {error : err}});
      if(!find || (find && find.error)){
        let error = (find && find.error) ? find.error : "category Not Found";
        return {error , status :404}
      }

      return { data : find}
}

//joi validation view 
async function checkView(param){
    let schema = joi.object({
                              id : joi.number().required()
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

module.exports = { add, update, viewall,dAndR , view }