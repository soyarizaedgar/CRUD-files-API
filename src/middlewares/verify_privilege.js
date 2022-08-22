function verifyPrivilege (req, res, next){
    
    // VALIDATING PRIVILEGE
    const privilege = req.headers['privilege'];
    if (privilege != 'A') {
        return res.status(401).send({
            auth: false,
            message: "You don't have privilege to access"
        })
    }
    next();
}

module.exports = verifyPrivilege;