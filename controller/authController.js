let user = require("../model/userModel");


// register controller 

async function Register(req, res) {
    let data = await user.Register(req.body).catch((err) => {
        return { error: err }
    });

    if (!data || (data && data.error)) {

        let error = data.error ? data.error : "Internal Server Error";
        console.log(error)
        return res.status(500).send({ error })
    }
    return res.status(200).send({ data: data.data });
}
//////////////////////////////////////////////////////////////////////
//login controller

async function Login(req, res) {
    let data = await user.Login(req.body).catch((err) => {
        return { error: err }
    });

    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "Internal Server Error";

        return res.status(500).send({ error: error })
    }

    let token = data.token
    return res.status(200).header("X-auth-token", token).send({ data: data.data });
}
//////////////////////////////////////////////////////////////////////////////////////////////
//forget password controller

async function forgetPassword(req, res) {
    let data = await user.forgetPassword(req.body).catch((err) => {
        return { error: err }
    });

    if (!data || (data && data.error)) {
        let error = (data || data && data.error) ? data.error : "internal server error";
        return res.status(500).send({ error: error })
    }
    return res.status(200).send({ data: data.data });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//reset password controller
async function resetPassword(req, res) {
    let data = await user.resetPassword(req.body).catch((err) => {
        return { error: err }
    });

    if (!data || (data && data.error)) {
        let error = (data || data && data.error) ? data.error : "internal server error";
        return res.status(500).send({ error: error })
    }
    return res.status(200).send({ data: data.data });
}
module.exports = { Register, Login, forgetPassword,resetPassword }