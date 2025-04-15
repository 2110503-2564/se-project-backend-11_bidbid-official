const jwt = require('jsonwebtoken');
const User =require('../models/User');
const Therapist = require('../models/Therapist');

//Protect routes

exports.protect = async (req, res, next) => {
    let token;
  
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
  
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      console.log('Decoded token:', decoded);

      req.user = {
        id: decoded.id,
        role: decoded.role,
      };
  
      next();
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Token invalid' });
    }
  };

//Grant access to specific roles
exports.authorize=(...roles) => {
    return (req,res,next)=>{
        console.log(req.user.role); // debug
        if(!roles.includes (req.user.role)){
            return res.status(403).json({ success:false, message: `User role ${req.user.role} is not authorized to access this route` });
        }
        next();
    }
}