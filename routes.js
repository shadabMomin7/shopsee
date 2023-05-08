let express = require("express");
let userAuth = require("./controller/authController");
let category = require("./controller/categoryController");
let config = require("config");
let url = config.get("url");
let route = express.Router();
let { auth } = require("./middleware/authMiddleware");
let product = require("./controller/productController");
const { products } = require("./schema/productSchema");

//auth routes APi
route.post(url.auth.Register, userAuth.Register);
route.post(url.auth.Login, userAuth.Login);
route.get(url.auth.forget, userAuth.forgetPassword);
route.get(url.auth.reset, userAuth.resetPassword);

//category Routes APi
route.post(url.category.add, auth("add_product"), category.add);
route.put(url.category.update, auth("update_product"), category.update);
route.get(url.category.viewall, auth("view_product"), category.viewall);

//products Routes Api 
route.post(url.product.add, auth("add_product"),product.add);
route.post(url.product.update,auth("update_product"),product.update);
// route.get(url.product.viewall,auth("view_porduct"),product.viewall);


// route.get(url.error.errorhandling, (req, res) => {
    // console
// });

module.exports = { route }