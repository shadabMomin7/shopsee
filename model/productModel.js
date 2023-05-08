let joi = require("joi");
const { products } = require("../schema/productSchema");
const { where, Op } = require("sequelize");
const { Category } = require("../schema/categorySchema");
const { product_category } = require("../schema/productCategorySchema");

async function add(param, userdata) {
    let check = await addproduct(param).catch((err) => {
        return { error: err }
    });
    if (!check || (check && check.error)) {
        let error = (check && check.error) ? check.error : "check details";
        return { error, status: 400 }
    }
    let product_verify = await products.findOne({ where: { name: param.name }, raw: true }).catch((err) => {
        return { error: err }
    });

    if (product_verify) {
        let error = (product_verify && product_verify.error) ? product_verify.error : "product not found";
        return { error, status: 400 }
    }
    if (param.discount_type == 1) {
        // param.discount_type = 1, amount =1
        param["price_after_discount"] = param.price - param.discounted;
    }

    if (param.discount_type == 0) {
        // param.discount_type = 0, percentage = 0
        let amount = param.price * param.discounted / 100;
        param["price_after_discount"] = param.price - amount
    }
    // console.log("user data", userdata)
    param["created_by"] = userdata.id
    param["updated_by"] = userdata.id


    let product = await products.create(param).catch((err) => {
        return { error: err }
    });
    if (!product || (product && product.error)) {
        let error = (!product || (product && product.error)) ? product.error : "can't create product";
        return { error, status: 404 }
    }
    if (typeof (param.category) !== "object" || !Array.isArray(param.category)) {
        return { data: product }
    }

    let cat = await Category.findAll({ where: { id: { [Op.in]: param.Category } } }).catch((err) => {
        return { error: err }
    });
    if (!cat || (cat && cat.error)) {
        return { data: product }
    }

    let product_cat = [];
    for (let record of cat) {
        product_cat.push({ p_id: products.id, c_id: Category.id });
    }

    let p_cat = await product_category.bulkCreate(product_cat).catch((err) => {
        return { error: err }
    });
    if (!p_cat || (p_cat && p_cat.error)) {
        let error = (!p_cat || (p_cat && p_cat.error)) ? p_cat.error : "p_cat not added";
        return { error, status: 500 }
    }
    return { data: product };

}
async function addproduct(param) {
    let schema = joi.object({
        name: joi.string().min(4).max(50).required(),
        price: joi.string().min(1).required(),
        description: joi.string().required(),
        details: joi.object({
            size: joi.string().min(10).max(250).required(),
            colour: joi.string().required(),
            material: joi.string().required()
        }),
        stocks: joi.number().required(),
        stock_alart: joi.number().required(),
        discount_type: joi.string().required(),
        discounted: joi.number().required(),
        is_active: joi.boolean().required(),
        category: joi.array()
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

async function update(param, userdata) {
    let check = await updateproduct(param).catch((err) => {
        return { error: err }
    });
    if (!check || (check && check.error)) {
        let error = (check && check.error) ? check.error : "Invalid Data";
        return { error, status: 401 }
    }
    let product = await products.findOne({ where: { id: param.id } }).catch((err) => {
        return { error: err }
    });
    if (!product || (product && product.error)) {
        let error = (product && product.error) ? product.error : "data not found";
        return { error, status: 401 }
    }
    if (param.discount_type == 1) {
        // param.discount_type = 1, amount =1
        param["price_after_discount"] = param.price - param.discounted;
    }

    if (param.discount_type == 0) {
        // param.discount_type = 0, percentage = 0
        let amount = param.price * param.discounted / 100;
        param["price_after_discount"] = param.price - amount
    }

    param["updated_by"] = userdata.id

    let update = await products.update(param, { where: { id: param.id } }).catch((err) => {
        return { error: err }
    });
    if (!update || (update && update.error)) {
        let error = (update && update.error) ? update.error : "error while updating";
        return { error, status: 401 }
    }
    return { data: "product updated", status: 200 }
}

async function updateproduct(param) {
    let schema = joi.object({
        id: joi.number().min(1).required(),
        name: joi.string(),
        price: joi.number().min(1),
        descreption: joi.string(),
        details: joi.object(),
        stocks: joi.number().min(10),
        stock_alart: joi.string(),
        discount_type: joi.string(),
        discounted: joi.number(),
        is_delete: joi.boolean(),
        is_active: joi.boolean(),
        category: joi.array()

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

//check joi velidation.
async function assign(param) {
    let check = await assigncategory(param).catch((err) => {
        return { error: err }
    });
    if (!check || (check && check.error)) {
        let error = (!check || (check && check.error)) ? check.error : "invalid detail"
        return { error, status: 401 }
    }
//find product via id
    let product = await products.findOne({ where: { id: param.id } }).catch((err) => {
        return { error: err }
    });
    if (!product || (product && product.error)) {
        let error = (!product || (product && product.error)) ? product.error : "product not found";
        return { error, status: 400 }
    }
//apply for loop 
    let productCatgeory = []
    for (let record in param.category) {
        productCatgeory.push({ p_id: products.id, c_id: Category.id }).catch((err) => {
            return { error: err }
        });
    }
//delete previous product data
    let del = await product_category.destroy({ where: { id: p.id } }).catch((err) => {
        return { error: err }
    });
    if (del.error) {
        return { error:"can't assign category"}
    }
//create new product
    let prod_cat = await product_category.bulkcreate(productCatgeory).catch((err) => {
        return { error: err }
    });
    if (!prod_cat || (prod_cat && prod_cat.error)) {
        let error = (prod_cat && prod_cat.error) ? prod_cat.error : "prod_cat not added";
        return { error, status: 500 }
    }
    return { data: product }
}

async function assigncategory(param) {
    let schema = joi.object({
        id: joi.number().required(),
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
        return { errro: msg }
    }
    return { data: valid.data }
}


async function viewall(param) {
    let check = await viewproduct(param).catch((err) => {
        return { error: err }
    });
    if (!check || (check && check.error)) {
        return { error: check.error }
    }
}

async function viewproduct(param) {
    let schema = joi.object({
        id: joi.number(),
        name: joi.string(),
        price: joi.number().min(1),
        descreption: joi.string(),
        details: joi.object(),
        stock: joi.number(),
        stock_alart: joi.string(),
        discount_type: joi.string(),
        discounted: joi.number(),
        is_delete: joi.boolean(),
        is_active: joi.boolean()
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

module.exports = { add, update ,assign}


// if (param.discount_type === "amount") {
//     param.discount_type = 1
//     param[""] = param.discount - param.price
// }


// if (param.discount_type === "percentage") {
//     param.discount_type = 0
//     let amount = param.price * param.discount / 100

//     param["price_after_discount"] = param.price - amount

// }