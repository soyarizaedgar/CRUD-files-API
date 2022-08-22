module.exports = app =>{

    const files = require("../controllers/files.controller");
    const filesmultter = require("../middlewares/multer.files");

    const verifyToken = require("../middlewares/verify_token")


    app.get("/files/:userId",verifyToken, files.getAll);

    app.get("/file/:fileId",verifyToken, files.getSingle);

    app.get("/download/:fileId",verifyToken, files.download);
       
    app.post("/file",verifyToken, filesmultter, files.upload);

    app.put("/file",verifyToken, files.update);

    app.delete("/file/:fileId",verifyToken, files.deleteSingle);


}