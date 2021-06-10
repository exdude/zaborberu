const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "../public/assets/img/uploads");
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname);
    }
})
const uploads = multer({storage: storage})


module.exports = uploads.fields([
    {name: 'img', maxCount: 1},
    {name: 'scheme', maxCount: 1}
])