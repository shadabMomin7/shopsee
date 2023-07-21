let {logger} = require('../helper/log');

function globalErrorHandler(error, req, res, next) {
    logger("error", req.url);
    logger("error", req.params, req.query, req.body);
    logger("error", `error from global error handler middleware line no :6 ${error.message}`);

    if(error == "you are not whitelisted"){
       error = "you are not whitelisted"
    }else{ error = "internal server error | global error handler"}

    // error = (error == "error: you are not whitelisted") ? "error: you are not whitelisted": error;
    res.status(500).send({ error });
}

module.exports = { globalErrorHandler }


// app.use((error, req, res, next) => {
//     console("URL", req.url)
//     console.log("Param", req.body, req.params, req.query)
//     console.log("Globel Error", error);

//     return res.status(500).send({ error: (error && error.error)?error.error:"internal error" });
// });
// app.get("/test/",(req,res)=>{abd});
