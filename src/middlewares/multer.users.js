const multer  = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');


const storage = multer.diskStorage({
    
    destination: './public',
    filename: (req, file, cb) => {
         cb(null, uuidv4() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage, 
    limits: {fileSize: 2000000},
    fileFilter: (req,file,cb) =>{
        const filetypes = /jpeg|jpg|png|svg/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname));
        if (mimetype && extname) {
            return cb(null,true)
        }
        cb("File should be an extension: jpeg/jpg/png");
    }
}).single('profilePhoto');

module.exports = upload;