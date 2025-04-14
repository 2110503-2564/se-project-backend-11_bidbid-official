const jwt = require('jsonwebtoken');
const User =require('../models/User');
const Therapist = require('../models/Therapist');

//Protect routes
exports.protect=async (req, res,next)=> {
    let token;
    
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    //Make sure token exists
    if(!token) {
        return res.status(401).json({success:false, message: 'Not authorize to access this route'});
    }

    try {
        //Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded:', decoded);

        let user = await User.findById(decoded.id);
        if (!user) {
            user = await Therapist.findById(decoded.id); // เพิ่มเช็ค therapist
        }

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        req.user = user;
        next();
    } catch(err) {
        console.log(err.stack);
        return res.status(401).json({success:false, message:'Not authorize to access this route'});
    }
}

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