let express = require("express");
require("express-async-errors");
let cors = require("cors")
let {corsconfig} = require("./middleware/corsMiddleware");
let {globalErrorHandler} = require('./middleware/errorhandler')
let { route } = require("./routes");
let config = require("config");
let port = config.get("port")
let app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: corsconfig })); 
app.use(route);

// app.use((error, req, res, next) => {
//     console.log("URL", req.url)
//     console.log("Param", req.body, req.params, req.query)
//     console.log("Globel Error", error);

//     return res.status(500).send({ error: (error && error.error)?error.error:"internal error" });
// });
// app.get("/test/",(req,res)=>{abd});


app.use(globalErrorHandler);
app.listen(port, () => { console.log(`${port} running on`) });
 