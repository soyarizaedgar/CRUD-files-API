const sql = require("./db");

const File = function(file){
    this.user_id = file.user_id;
    this.title = file.title;
    this.filePath = file.filePath;
    this.filePathThumb = file.filePathThumb;
    this.uploadedAt = file.uploadedAt || new Date();
    this.updatedAt = file.updatedAt || new Date();
}

File.getAll = (userId, result) => {
    sql.query("SELECT * FROM files WHERE user_id=? ORDER BY uploadedAt DESC LIMIT 20", userId, (err, res)=>{
        if(err){
            console.log('error:',err);
            result (null, err);
            return;
        }
        result (null, res);
    })
}

File.getSingle = (fileId, result) => {
    sql.query("SELECT * FROM files WHERE id=?", fileId, (err,res)=>{
        if(err){
            result(null,err);
            return;
        }
        result(null, res);
    });
}

File.upload = (file, result) =>{
    sql.query("INSERT INTO files SET ?",
    file,
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

File.update = (fileId, file, result) =>{
    sql.query(
        "UPDATE files SET title=?, updatedAt=? WHERE id=?",
    [
        file.title,
        file.updatedAt,
        fileId
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

File.deleteSingle = (fileId, result)=>{
    sql.query("DELETE FROM files WHERE id=?", fileId,(err,res)=>{
        if(err){
            result(null,err);
            return;
        }
        result(null, res);
    });
}

File.deleteAll = (userId, result)=>{
    sql.query("DELETE FROM files WHERE user_id=?", userId,(err,res)=>{
        if(err){
            result(null,err);
            return;
        }
        result(null, res);
    });
}


module.exports = File;