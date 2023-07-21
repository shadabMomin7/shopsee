let express = require("express");
require("express-async-errors");
let cors = require("cors")
let {corsconfig} = require("./middleware/corsMiddleware");
let {globalErrorHandler} = require('./middleware/errorhandler')
let { route } = require("./routes");
let config = require("config");
let port = config.get("port")
let app = express();
let {logger} = require('./helper/log');

//global middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: corsconfig })); 
app.use(route);



//global error handler middleware
app.use(globalErrorHandler);



//server creation 
app.listen(port, () => { logger('info',`${port} running on`) });
 