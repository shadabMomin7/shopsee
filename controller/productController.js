let product = require("../model/productModel");
const { products } = require("../schema/productSchema");

// add product controller (Api)
async function add(req, res) {
    let data = await product.add(req.body, req.userdata).catch((err) => {
        return { error: err }
    });
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "internal server error";
        let status = (data && data.status) ? data.status : 500;
        return res.status(status).send({ error });
    }
    let status = (data && data.status) ? data.status : 201;
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
    let data = await product.assign(req.body, req.userdata).catch((err) => {
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


module.exports = { add, update, assign }