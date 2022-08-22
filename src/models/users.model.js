const sql = require("./db");

const User = function(user){
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.password = user.password;
    this.privilege = user.privilege || 'R';
    this.createdAt = user.createdAt || new Date();
    this.updatedAt = user.updatedAt || new Date();
    this.profilePhotoPath = user.profilePhotoPath || '../public/default/default_profile.svg';
    this.profilePhotoPathThumb = user.profilePhotoPathThumb || null;
}

User.getAll = result => {
    sql.query("SELECT * FROM users LIMIT 5", (err, res)=>{
        if(err){
            console.log('error:',err);
            result (null, err);
            return;
        }
        result (null, res);
    })
}

User.filter = (firstName, result) => {
    sql.query("SELECT * FROM users WHERE firstName=? LIMIT 5", firstName, (err, res)=>{
        if(err){
            console.log('error:',err);
            result (null, err);
            return;
        }
        result (null, res);
    })
}

User.getSingle = (userId, result) => {
    sql.query("SELECT * FROM users WHERE id=?", userId, (err,res)=>{
        if(err){
            result(null,err);
            return;
        }
        result(null, res);
    });
}

User.create = (user, result) =>{
    sql.query("INSERT INTO users SET ?",
    user,
    (err, res) =>{
        if(err){
            result(null, err);
            console.log(err);
            return;
        }
        result(null, res);
    }
    );
}

User.update = (userId, user, result) =>{
    sql.query(
        "UPDATE users SET firstName=?, lastName=? , email=?, password=?, privilege=?, updatedAt=? WHERE id=?",
    [
        user.firstName,
        user.lastName,
        user.email,
        user.password,
        user.privilege,
        user.updatedAt,
        userId
    ],
        (err, res) =>{
            if(err){
                result(null, err);
                return;
            }
            result(null, res);
        }
    );
};

User.delete = (userId, result)=>{
    sql.query("DELETE FROM users WHERE id=?", userId,(err,res)=>{
        if(err){
            result(null,err);
            return;
        }
        result(null, res);
    });
}

User.signin = (useremail, result) =>{
    sql.query("SELECT * FROM users WHERE email=?", useremail, (err,res)=>{
        if(err){
            result(null,err);
            return;
        }
        result(null, res);
    });
}

module.exports = User;