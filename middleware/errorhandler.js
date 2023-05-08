

function globalErrorHandler(error, req, res, next) {
    console.log("URL", req.url);
    console.log("Request Body", req.params, req.query, req.body);
    console.log("Globel Error Handler", error);
    res.status(500).send({ error: "internal server error" });
}

module.exports = { globalErrorHandler }


// app.use((error, req, res, next) => {
//     console.log("URL", req.url)
//     console.log("Param", req.body, req.params, req.query)
//     console.log("Globel Error", error);

//     return res.status(500).send({ error: (error && error.error)?error.error:"internal error" });
// });
// app.get("/test/",(req,res)=>{abd});
