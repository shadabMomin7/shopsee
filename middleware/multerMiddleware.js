let express = require("express");
let multer = require("multer");
let app = express();
let uplode  = multer();

let storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"")
    }
    
})