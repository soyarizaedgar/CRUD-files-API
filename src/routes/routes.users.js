module.exports = app =>{

    const users = require("../controllers/users.controller");
    const usersmultter = require("../middlewares/multer.users");

    const verifyToken = require("../middlewares/verify_token");
    const verifyPrivilege = require("../middlewares/verify_privilege")
       
    // Get all users
    app.get("/users",verifyPrivilege, verifyToken, users.getAll);

    // Get a single user
    app.get("/user/:userId", verifyToken, users.getSingle);

    app.get("/filter/:firstName",verifyToken, users.filter);

    app.post("/signup",usersmultter, users.create);

    app.post("/signin", users.signin);

    app.put("/user", verifyToken, users.update);

    app.delete("/user/:userId", verifyToken, users.delete);

}