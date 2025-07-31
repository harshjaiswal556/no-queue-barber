const jwt = require('jsonwebtoken');

const User = require('../schema/user');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const verify = jwt.verify(token, process.env.JWT_SECRET);
            
            req.user = await User.findById(verify.id).select("-password");            
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }else{
        res.status(401).json({ message: 'No token provided, authorization denied' });
    }
};

module.exports = protect;