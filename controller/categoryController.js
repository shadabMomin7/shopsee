let category = require("../model/categoryModel");

async function add(req, res) {
    let data = await category.add(req.body, req.userdata).catch((err) => {
        return { error: err }
    });

    if (!data || (data && data.error)) {

        let error = (data && data.error) ? data.error : "internal server error"
    console.log("error form cat controller", data.error)
        return res.status(500).send({ error: error });
    }
    return res.send({ data: data.data });
}

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

async function viewall(req, res) {
    let data = await category.viewall(req.query, req.userdata).catch((err) => {
        return { error: err }
    });

    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "internal server error";
        console.log("error from controller cat veiw",error)
        return res.status(500).send({ error: error });;
    }
    return res.send({ data: data })
}

module.exports = { add, update, viewall }