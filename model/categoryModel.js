let { Category } = require("../schema/categorySchema");
let joi = require("joi");


//category add (APi)

async function add(param, userdata) {
      //joi validation 
    let validate = await addCategory(param).catch((err) => {
        return { error: err }
    });
    if (!validate || (validate && validate.error)) {
        return { error: validate.error }
    }
    //check category with 
    if (param.p_id) {
        let cat = await Category.findOne({ where: { id: param.p_id } }).catch((err) => {
            return { error: err }
        });
        if (!cat || (cat && cat.error)) {
            
            return { error: "category parent id not found" }
        }
    }

    param["created_by"] = userdata.id
    param["updated_by"] = userdata.id

    let create = await Category.create(param).catch((err) => {
        return { error: err }
    });
    if (!create || (create && create.error)) {
        return { error: " error on category adding" }
    }
    return { data: create }
}

//joi validations add category 

async function addCategory(param) {
    let schema = joi.object({
        name: joi.string().min(4).max(50).required(),
        p_id: joi.number().min(1).required()
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

    let verify = await updateCategory(param).catch((err) => {
        return { error: err }
    });

    if (!verify || (verify && verify.error)) {
        return { error: verify.error }
    }

    if (param.id) {
        let category = await Category.findOne({ where: { id: param.id } }).catch((err) => {
            return { error: err }
        });
        if (!category || (category && category.error)) {
            let error = (category && category.error) ? category.error : "category not found ! data not found"
            return { error, status: 404 }
        }
    }

    param["created_by"] = userdata.id
    param["updated_by"] = userdata.id

    let update = await Category.update(param, { where: { id: param.id } }).catch((err) => {
        return { error: err }
    });
    if (!update || (update && update.error)) {
        let error = (update || (update && update.error)) ? update.error : "error while updating"
        return { error, status: 505 }
    }
    return { data: "updated successfully",update, status: 200 }
}

//joi validation category upated

async function updateCategory(param) {
    let schema = joi.object({
        id: joi.number().min(1).required(),
        name: joi.string().min(4).max(50),
        p_id: joi.number().min(1)
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
    let check = await viewCategory(param).catch((err) => {
        return { error: err }
    });

    if (!check || (check && check.error)) {

        let error = (check && check.error) ? check.error : "provide proper data";
        return { error, status: 401 }
    }
    
    let where = {}
    if (param.id) { where["id"] = param.id }
    if (param.name) { where["name"] = param.name }
    if (param.p_id) { where["p_id"] = param.p_id }

    let record = (param.record) ? param.record : 10;
    let page = (param.page) ? param.page : 1;
    let offset = record * (page - 1);

    let count = await Category.count({ where: where }).catch((err) => {
        return { error: err }
    });
    if (!count || (count && count.error)) {
        let error = (count && count.error) ? count.error : "internal server error"
        return { error, status: 401 }
    }

    let category = await Category.findAll({
        where: where,
        limit: record,
        offset: offset
    }).catch((err) => {
        return { error: err }
    });
    if (!category || (category && category.error)) {
        let error = (category && category.error) ? category.error : "internal server error"
        return { error, status: 401 }
    }

    let res = {
        data: category,
        total: count,
        page: page,
        record: record
    }
    return res;
}
//joi validation view category 
async function viewCategory(param) {
    let schema = joi.object({
        id: joi.number(),
        name: joi.string().min(4).max(100),
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
module.exports = { add, update, viewall }