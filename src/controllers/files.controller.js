const File = require("../models/files.model");
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// GET ALL FILES OF A USER
exports.getAll = (req,res)=>{
   
    // SENDING REQUEST
    File.getAll(req.params.userId, (err, data)=>{
        if(err){
            res.status(500).send({
                message: err.message || "Server error getting user's files"
            });
        }
        else{
            res.status(200).send(data);
        }
    })
}

// GET SINGLE FILE
exports.getSingle = (req, res) =>{

    if(!req.params.fileId){
        res.status(400).send({
            message: "Error: file id not sprecified"
        });
    }

    File.getSingle(req.params.fileId, (err,data)=>{
        if(err){
            res.status(500).send({
                message: err.message || "Server error getting user"
            });
        }
        else{
            if(data.length){
                data.forEach(dataobj =>{
                    res.status(200).send(dataobj);
                });
            }
            else{
                res.status(404).send({
                    message: "File not found"
                });
            }
        }
    });
};

// UPLOAD A FILE
exports.upload = (req,res) =>{

    // VALIDATIONS
    if(req.body.length){
        res.status(400).send({
            message: "you must include the data to be saved"
        });
        fs.rmSync( req.file.path);
    }
    if(!req.body.title){
        res.status(400).send({
            message: "title not specified"
        });
        fs.rmSync( req.file.path);
    }
    if(!req.body.user_id){
        res.status(400).send({
            message: "user id not specified"
        });
        fs.rmSync( req.file.path);
    }

    // MOVE AND GENERATE THUMBNAIL
    const folderPath = path.join('./public',req.body.user_id,'files');
    
    fs.rename(req.file.path, path.join(folderPath,req.file.filename) , (err)=>{
        if (err) {
            return console.error(err);
        }
    });
    
    req.file.path =  path.join(folderPath,req.file.filename);
    req.body.filePath = req.file.path;

    const filetypes = /jpeg|jpg|png|svg/;
    const mimetype = filetypes.test(req.file.mimetype);
    const extname = filetypes.test(path.extname(req.file.originalname));

    req.body.filePathThumb = '';
    
    if (mimetype && extname) {
       console.log("It's an image")
       // GENERATE THUMBNAIL
       sharp(req.file.path).resize(200, null).toFile(folderPath + '/' +
           'thumbnail' + req.file.filename, (err, resizeImage) => {
               if (err) {
                   console.log(err);
               }else{
                   console.log(resizeImage);
    
               }
           });
           req.body.filePathThumb = path.join(folderPath, 'thumbnail' + req.file.filename);
    }else{
        console.log("It's a document")
        req.body.filePathThumb = 'public/default/default_doc.svg';
    }
    
    console.log(req.body);

    // SENDING REQUEST
    File.upload(new File (req.body), (err,data) =>{
        if(err){
            res.status(500).send({
                message: err.message || "server error catching"
            });
        }
        else{
            res.status(200).send({
                message: "file upload succesfully",
                fileid: data.insertId
            });
        }
    });
}

// UPDATE A FILE
exports.update = (req,res)=>{

    // VALIDATIONS
    if(req.body.length){
        res.status(400).send({
            message: "you must include the data to be saved"
        });
    }
    if(!req.body.title){
        res.status(400).send({
            message: "title is missing"
        });
    }
    if(!req.body.id){
        res.status(400).send({
            message: "id is missing"
        });
    }
    
    req.body.updatedAt = new Date();

    File.update(req.body.id, new File(req.body), (err, data) =>{
        if(err){
            res.status(500).send({
                message: err.message || "server error updating"
            });
        }
        else{
            File.getSingle(req.body.id, (err,data2)=>{
                res.send({
                    message: "file updated succesfully",
                    user: data2
                }) 
            })
        }
    })
}

// DELETE FILE
exports.deleteSingle = (req, res)=>{

    // VALIDATIONS
    if(!req.params.fileId){
        res.status(400).send({
            message: "Error: file id not sprecified"
        });
    }

    // DELETING FILE
    File.getSingle(req.params.fileId, (err,data)=>{
        
        data.forEach(dataobj =>{
            console.log(dataobj);
            if(fs.existsSync(dataobj.filePath)){
                fs.rmSync(dataobj.filePath);
            }
            if(fs.existsSync(dataobj.filePathThumb)){
                if (dataobj.filePathThumb != 'public/default/default_doc.svg' ) {
                    fs.rmSync(dataobj.filePathThumb);   
                }
            }
        })
        
    })

    // SENDING REQUEST TO DB
    File.deleteSingle(req.params.fileId, (err,data)=>{
        if(err){
            res.status(500).send({
                message: err.message || "Error deleting user"
            });
        }
        else{
            res.status(200).send({
                message: "file deleted succesfully",
                file_deleted: req.params.fileId
            });
        }
    });
}

//DOWNLOAD FILES

exports.download = (req, res)=>{

    // VALIDATIONS
    if(!req.params.fileId){
        res.status(400).send({
            message: "Error: file id not sprecified"
        });
    }

    File.getSingle(req.params.fileId, (err,data)=>{
        if(err){
            res.status(500).send({
                message: err.message || "Server error getting user"
            });
        }
        else{
            if(data.length){
                data.forEach(dataobj =>{
                    if (dataobj.filePathThumb == 'public/default/default_doc.svg'){
                        res.download(dataobj.filePath);
                    }
                    // else{
                    //     res.send(dataobj.filePath);
                    // }

                });
            }
            else{
                res.status(404).send({
                    message: "File not found"
                });
            }
        }
    });

}