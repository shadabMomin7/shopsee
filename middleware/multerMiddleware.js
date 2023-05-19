let multer = require("multer");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Gallary/photos")
  },
  fileName: function(req,file,cb){
   let  unique = Date.now() + "-" + Math.round(math.random()*1E9)
   let extension = file.originalname.split(".").pop()
   cb(null,unique + extension)
  }


})

