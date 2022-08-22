const jwt = require('jsonwebtoken');
const config = require('../config/jwt')

function verifyToken (req, res, next){
    
    // VALIDATING TOKEN
    const token = req.headers['access-token'];
    if (!token) {
        return res.status(401).send({
            auth: false,
            message: "No token provieded"
        })
    }

    const decoded = jwt.verify(token, config.secret);

    console.log(decoded);
    req.userId = decoded.id;
    next();
}

module.exports = verifyToken;