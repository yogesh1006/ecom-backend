const multer  = require('multer')
const fs= require('fs')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      fs.mkdir('uploads/product', { recursive: true }, (err) => {
        if (err) throw err
        cb(null, 'uploads/product')
      });
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+ file.originalname)
    }
  })
   
  const upload = multer({ storage: storage })
  const remove= (dest,cb)=>{
      
    fs.unlink(dest, (err) => {
        if (err) throw err;
    });
  }



  module.exports= {upload, remove}