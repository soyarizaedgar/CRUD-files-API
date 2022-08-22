const User = require("../models/users.model");
const File = require("../models/files.model");

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const fs = require('fs');
const path = require('path');


const sharp = require('sharp');

const jwt = require('jsonwebtoken');
const config = require('../config/jwt');
const { decode } = require("punycode");

// GET ALL USERS
exports.getAll = (req, res)=>{

    User.getAll((err,data)=>{
        if(err){
            res.status(500).send({
                message: err.message || "Server error getting all users"
            });
        }
        else{
            res.status(200).send(data);
        }
    });
};

// FILTER USERS
exports.filter = (req, res) =>{

    if(!req.params.firstName){
        res.status(400).send({
            message: "Error: firstName not specified"
        });
    }

    User.filter(req.params.firstName, (err,data)=>{
        if(err){
            res.status(500).send({
                message: err.message || "Server error getting user"
            });
        }
        else{
            if(data.length){
                res.status(200).send(data);
            }
            else{
                res.status(404).send({
                    message: "User not found"
                });
            }
        }
    });
};


// GET SINGLE USER
exports.getSingle = (req, res) =>{

    if(!req.params.userId){
        res.status(400).send({
            message: "Error: user id not sprecified"
        });
    }

    User.getSingle(req.params.userId, (err,data)=>{
        if(err){
            res.status(500).send({
                message: err.message || "Server error getting user"
            });
        }
        else{
            if(data.length){
                data.forEach(dataobj => {
                    {dataobj.password = ''};
                    res.status(200).send(dataobj); 
                })
            }
            else{
                res.status(404).send({
                    message: "User not found"
                });
            }
        }
    });
};


// CREATE NEW USER
exports.create = (req,res) =>{

    
    // GENERATE ID
    const id = uuidv4();
    const id2 = id.replace(/[^0-9]/g,''); 
    // TRY TO DON'T USE 0 AT FIRST POSITION
    const id3 = id2.substr(0,8);
    req.body.id = id3
   
    //CREATING DIRECTORY
    const folderPath = path.join('public',req.body.id);

    fs.mkdirSync(folderPath, (err)=>{
        if (err) {
            return console.error(err);
        }
    });
    fs.mkdirSync(path.join(folderPath, 'profile'), (err)=>{
        if (err) {
            return console.error(err);
        }
    });
    fs.mkdirSync(path.join(folderPath, 'files'), (err)=>{
        if (err) {
            return console.error(err);
        }
    });

    req.body.profilePhotoPath = '';
    req.body.profilePhotoPathThumb = ''

    // IF A PROFILE PHOTO WAS SELECTED
    if (typeof req.file === "undefined") {
        console.log("Profile photo is not selected");
        req.body.profilePhotoPath = 'public/default/default_profile.svg';
        req.body.profilePhotoPathThumb = 'public/default/default_profile.svg'
    }
    else{
        // MOVE PHOTO TO A FOLDER
        console.log("Good photo!")
        fs.rename(req.file.path, path.join(folderPath,'profile', req.file.filename) , (err)=>{
            if (err) {
                return console.error(err);
            }
        })
        req.body.profilePhotoPath = path.join(folderPath, 'profile',req.file.filename);

        // GENERATE THUMBNAIL
        sharp(req.body.profilePhotoPath).resize(200, null).toFile(folderPath + '/profile/' +
            'thumbnail' + req.file.filename, (err, resizeImage) => {
                if (err) {
                     console.log(err);
                }
            });
        
        req.body.profilePhotoPathThumb = path.join(folderPath,'profile', 'thumbnail' + req.file.filename);
    };   
    
    // VALIDATIONS
    if(req.body.length){
        fs.rmdirSync(folderPath, { recursive: true });
        res.status(400).send({
            message: "you must include the data to be saved"
        });
    }
    if(!req.body.firstName){
        fs.rmdirSync(folderPath, { recursive: true });
        res.status(400).send({
            message: "First name is missing"
        });
    }
    if(!req.body.lastName){
        fs.rmdirSync(folderPath, { recursive: true });
        res.status(400).send({
            message: "Last Name is missing"
        });
    }
    if(!req.body.email){
        fs.rmdirSync(folderPath, { recursive: true });
        res.status(400).send({
            message: "Email is missing"
        });
    }
    if(!req.body.password){
        fs.rmdirSync(folderPath, { recursive: true });
        res.status(400).send({
            message: "Password is missing"
        });
    }
     
    // HASH PASSWORD

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        
        req.body.password = hash;
        console.log(req.body);
       
        // SENDING REQUEST
        User.create(new User(req.body), (err,data)=>{
            
            if(err){
                res.status(500).send({
                    message: err.message || "server error catching"
                });
            }
            else{

                // SET HEADER OF A REGULAR USER PRIVILEGE
                res.set('privilege', data.privilege);
                res.set('user_id',req.body.id)
               
                // GENERATE TOKEN
                const token = jwt.sign({id: req.body.id}, config.secret, {
                    expiresIn: 86400
                    // 1 DAY IN SEC = 60sec * 60min * 24h
                })
                res.set('access-token', token);

                res.status(200).send({
                    message: "user created succesfully",
                    user_id: req.body.id,
                    auth: true,
                    token
                });
                
            }
        });
    }); 

}

// UPDATE A USER
exports.update = (req, res)=>{

    
    // VALIDATIONS
    req.body.updatedAt = new Date();

    if(req.body.length){
        res.status(400).send({
            message: "you must include the data to be saved"
        });
    }
    if(!req.body.id){
        res.status(400).send({
            message: "User id is missing"
        });
    }
    if(!req.body.firstName){
        res.status(400).send({
            message: "Fisrt name is missing"
        });
    }
    if(!req.body.lastName){
        res.status(400).send({
            message: "Last Name is missing"
        });
    }
    if(!req.body.email){
        res.status(400).send({
            message: "Email is missing"
        });
    }
    if(!req.body.privilege){
        res.status(400).send({
            message: "Privilege is missing"
        });
    }
    if(!req.body.password){
        res.status(400).send({
            message: "Password is missing"
        });
    }

    // HASH PASSWORD
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {

        req.body.password = hash;
        
        User.update(req.body.id, new User(req.body), (err, data)=>{
            if(err){
                res.status(500).send({
                    message: err.message || "server error updating"
                });
            }
            else{
                User.getSingle(req.body.id, (err,data2)=>{
                    res.send({
                        message: "user updated succesfully",
                        user: data2
                    }) 
                })
            }
        });
    });  
}

// DELETE USER
exports.delete = (req, res)=>{

    // VALIDATIONS
    if(!req.params.userId){
        res.status(400).send({
            message: "Error: user id not sprecified"
        });
    }

    // DELETE FOLDER

    User.getSingle(req.params.userId, (err,data)=>{
        
        data.forEach(dataobj =>{
            const folderPath = path.join('./public',dataobj.id);
            if(fs.existsSync(folderPath)){
                fs.rmSync(folderPath, { recursive: true });   
            }
        })
        
    });

    // DELETE ALL FILES OF A USER
    File.deleteAll(req.params.userId, (err,data)=>{
        if(err){
            res.status(500).send({
                message: err.message || "Error deleting user's files"
            });
        }
    });

    // SENDING REQUEST
    User.delete(req.params.userId, (err,data)=>{
        if(err){
            res.status(500).send({
                message: err.message || "Error deleting user"
            });
        }
        else{
            res.status(200).send({
                message: "user deleted succesfully",
                user_deleted: req.params.userId
            });
        }
    });
}

// SIGN IN
exports.signin = (req, res)=>{

    // VALIDATIONS
    if(!req.body.email){
        res.status(400).send({
            message: "Email is missing"
        });
    }
    if(!req.body.password){
        res.status(400).send({
            message: "Password is missing"
        });
    }

    // SENDING REQUEST
    User.signin(req.body.email, (err,data) =>{
        if(err){
            res.status(500).send({
                message: err.message || "Error deleting user"
            });
        }
        else{
            if(data.length){

                // VALIDATE PASSWORD AND GENERATE TOKEN
                data.forEach(dataobj =>{
                    // const email = dataobj.email
                    bcrypt.compare(req.body.password, dataobj.password, function(err, result){

                        if (result === false) {
                            return res.status(401).send({
                                message: "password or email incorrect",
                                auth: false, 
                                token: null
                            });
                        }
                        // SET HEADER OF USER'S PRIVILEGE
                        res.set('privilege', dataobj.privilege);
                        res.set('user_id',dataobj.id)

                        // GENERATE TOKEN
                        const token = jwt.sign({id: dataobj.id}, config.secret, {
                        expiresIn: 86400
                        // 1 DAY IN SEC = 60sec * 60min * 24h
                        })
                        res.set('access-token', token);

                        res.status(200).send({
                            message: "Great to have you back:)",
                            auth: true,
                            token,
                            user_id: dataobj.id,
                            privilege: dataobj.privilege
                        }); 
                    });
                });
            }
            else{
                res.status(404).send({
                    message: "password or email incorrect"
                });
            }
        }
    });
}


