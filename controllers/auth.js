const { response } = require('express');
const User = require('../models/User');
const Therapist = require('../models/Therapist');

//@desc Register user
//@route POST /api/v1/auth/register
//@access Public
// @desc Register user
// @route POST /api/v1/auth/register
// @access Public
exports.register = async (req, res, next) => {
    console.log("data:", req.body);
  
    try {
      const {
        name,
        email,
        phoneNumber,
        password,
        role,
        gender,
        age,
        experience,
        specialities,
        massageShop_name,
        massageShopID,
        licenseNumber,
        notAvailableDays,
        workingInfo,
      } = req.body;
  
      let user;
  
      // Step 1: Create User
      user = await User.create({
        name,
        email,
        phoneNumber,
        password,
        role,
      });
  
      console.log("User created:", user._id);
  
      // Step 2: If therapist, create Therapist
      if (role === 'therapist') {
        try {
          const therapist = await Therapist.create({
            user: user._id,
            gender,
            age,
            experience,
            specialities,
            licenseNumber,
            notAvailableDays,
            workingInfo,
            massageShopID,
            massageShop_name
          });
  
          console.log("Therapist created:", therapist._id);
        } catch (err) {
          console.error("Therapist creation error:", err.message);
  
          // Optional rollback
          await User.findByIdAndDelete(user._id);
  
          return res.status(400).json({
            success: false,
            error: `Therapist creation failed: ${err.message}`,
          });
        }
      }
  
      // Step 3: Return token
      sendTokenResponse(user, 200, res);
    } catch (err) {
      console.error("User registration error:", err);
      res.status(400).json({ success: false, error: err.message });
    }
  };
  
  
  
// exports.register = async (req, res, next)=> {
//     console.log(req.body);

//     try {
//         const { name, email, phoneNumber, password, role, ...therapistFields } = req.body;

//         let user;

//         if (role === 'therapist') {
//             // เก็บ therapist ลง Therapist collection
//             // user = await Therapist.create(req.body);
//             // user = await User.create(req.body);
//             user = await User.create({
//                 name,
//                 email,
//                 phoneNumber,
//                 password,
//                 role
//             });

//             await Therapist.create({
//                 user: user._id,
//                 ...therapistFields
//               });

//         } else {
//             // เก็บ user ลง Users collection
//             user = await User.create({
//                 name,
//                 email,
//                 phoneNumber,
//                 password,
//                 role
//             });
//         }

//         sendTokenResponse(user, 200, res);
//     } catch (err) {
//         res.status(400).json({ success: false, error: err.message });
//         console.log(err.stack);
//     }

// }

//@desc Login user
//@route POST /api/v1/auth/login
//@access Public
exports.login = async (req, res, next) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ success: false, msg: 'Please provide an email and password' });
    }
  
    // Always look in User collection
    const user = await User.findOne({ email }).select('+password');
  
    if (!user) {
      return res.status(400).json({ success: false, msg: 'Invalid credentials' });
    }
  
    const isMatch = await user.matchPassword(password);
  
    if (!isMatch) {
      return res.status(401).json({ success: false, msg: 'Invalid credentials' });
    }
  
    // Success: return token
    sendTokenResponse(user, 200, res);
  };
  
// exports.login=async (req, res, next) => {
//     const {email, password}=req.body;
//
//     if(!email || !password) {
//         return res.status (400).json({success:false, msg:'Please provide an email and password'});
//     }
//
//     const user =await User.findOne({email}).select('+password');
//     if(!user) {
//         return res.status(400).json({success:false, msg: 'Invalid credentials'});
//     }
//
//     const isMatch = await user.matchPassword(password);
//     if(!isMatch) {
//         return res.status (401).json({success: false, msg:'Invalid credentials'});
//     }
//
//     sendTokenResponse(user, 200, res);
// };

//Get token from model, create cookie and send response

const sendTokenResponse=(user, statusCode, res)=> {
    
    const token=user.getSignedJwtToken();

    const options = {
        expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
        httpOnly: true
    };

    if(process.env.NODE_ENV==='production') {
        options.secure=true;
    }

    // res.status(statusCode).cookie('token',token,options).json({
    //     success: true,
    //     token
    // })

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token ,
      });
}

// @desc Get current logged in user
// @route GET /api/v1/auth/me
// @access Private
exports.getMe = async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
  
      if (!user) {
        return res.status(404).json({ success: false, msg: "User not found" });
      }
  
      let therapist = null;
      if (user.role === 'therapist') {
        therapist = await Therapist.findOne({ user: user._id });
      }
  
      res.status(200).json({
        success: true,
        // data: {
        //   user,
        //   therapist, // could be null if role is not 'therapist'
        // },
        user,
        therapist,
      });
    } catch (err) {
      console.error("getMe error:", err);
      res.status(500).json({ success: false, error: "Server error" });
    }
  };
  

exports.logout = async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({
        success: true,
        data: {}
    });
};

