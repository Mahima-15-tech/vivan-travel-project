const JWT_SECRET = "rdk0786";
const jwt = require('jsonwebtoken');

const isAuthorize = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ') || !authHeader.split(' ')[1]) {
            return res.status(401).send({ status: false, message: "Please provide a token" });
        }
        
        const token = authHeader.split(' ')[1];
        console.log(JWT_SECRET);
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            msg: 'Internal Server Error'
        });
    }
};

module.exports = {
    isAuthorize
};
