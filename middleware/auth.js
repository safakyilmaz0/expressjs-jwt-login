const jwt = require("jsonwebtoken");


const verifyToken = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    //const decodedToken = jwt.verify(token,"secretkeyappearshere" );
    //res.status(200).json({success:true, data:{userId:decodedToken.userId,
    //        username:decodedToken.username}});
    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        req.user = jwt.verify(token, "secretkeyappearshere");
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

module.exports = verifyToken;