let category = require("../model/categoryModel");



// category add controller (Api)

async function add(req, res) {
    let data = await category.add(req.body, req.userdata).catch((err) => {
        return { error: err }
    });

    if (!data || (data && data.error)) {
         console.log("error from controller" , data.error)
        let error = (data && data.error) ? data.error : "internal server error"
        return res.status(500).send(error);
    }
    return res.send({ data: data.data });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// category update controller (Api)

async function update(req, res) {
    let data = await category.update(req.body, req.userdata).catch((err) => {
        return { error: err }
    });

    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "internal server error";
        return res.status(500).send({ error: error });
    }
    return res.send({ data: data.data });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  category viewAll cantroller (APi)

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

module.exports = { add, update, viewall }