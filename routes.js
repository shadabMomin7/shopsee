let express = require("express");
let userAuth = require("./controller/authController");
let category = require("./controller/categoryController");
let config = require("config");
let url = config.get("url");
let route = express.Router();
let { auth } = require("./middleware/authMiddleware");
let product = require("./controller/productController");
// let demo = require ("./controller/demo");
let image = require ("./controller/productImageController");
let addtocart = require ("./controller/addToCartController");


//auth (routes)
route.post(url.auth.Register, userAuth.Register);
route.post(url.auth.Login, userAuth.Login);
route.get(url.auth.forget, userAuth.forgetPassword);
route.put(url.auth.reset, userAuth.resetPassword);
route.put(url.auth.changePassword,auth("user"),userAuth.changePasswordContro);
route.post(url.auth.logout, auth("user") ,userAuth.logotController);

//category (Routes)
route.post(url.category.add, auth("add"), category.add);
route.put(url.category.update, auth("update"), category.update);
route.get(url.category.viewall, auth("user"), category.viewall);
route.delete(url.category.delete , auth("delete"), category.del);
route.put(url.category.restore , auth("restore"), category.restore);
route.get(url.category.view , auth("user") , category.viewController);

//products (Routes)
route.post(url.product.add,auth("add"),product.add);
route.put(url.product.update,auth("update"),product.update);
route.get(url.product.viewall,product.viewall);
route.post(url.product.assign ,auth("assign"),product.assign);
route.delete(url.product.product_delete , auth("delete"), product.deleteProduct);
route.put(url.product.restore_product , auth("restore"), product.restoreProduct);
route.get(url.product.viewSingle , product.viewProduct);


// product image (routes)
route.post(url.product.product_upload_image,auth("uploadImage"),image.productImageUpload);
route.delete(url.product.product_image_delete ,auth("delete"),image.productImageDelete);

///// add To Cart (routes)/////
route.post(url.addToCart.add ,auth("user"),addtocart.addToCartContro);
route.delete(url.addToCart.removeCart,auth("user"), addtocart.removeCart);
route.get(url.addToCart.viewCart , auth("user") ,addtocart.viewCart );






//testing routes
//route.post(url.testing.demo,demo.uploadFile)


// route.get(url.error.errorhandling, (req, res) => {
    // console
// });

module.exports = { route }