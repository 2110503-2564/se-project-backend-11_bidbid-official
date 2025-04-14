const Therapist = require('../models/Therapist');
const User = require('../models/User');

// @desc Get current therapist profile
// @route GET /api/v1/therapists/me
// @access Private (therapist only)
exports.getTherapist = async (req, res, next) => {
    // try {
    //     const therapist = await Therapist.findById(req.params.id);

    //     if (!therapist) {
    //         return res.status(404).json({ success: false, message: 'Therapist profile not found' });
    //     }

    //     res.status(200).json({ success: true, data: therapist });
    // } catch (err) {
    //     res.status(500).json({ success: false, message: 'Server Error' });
    // }

    try {
        const therapist = await Therapist.findById(req.params.id);

        if (!therapist) {
            return res.status(404).json({
                success: false,
                message: 'Therapist profile not found'
            });
        }

        // ตรวจสอบว่าผู้ใช้งานเป็นเจ้าของ profile หรือ admin
        if (
            req.user.role !== 'admin' &&
            therapist._id.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this profile'
            });
        }

        res.status(200).json({
            success: true,
            data: therapist
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc Update current therapist profile
// @route PUT /api/v1/therapists/me
// @access Private (therapist only)
exports.updateTherapist = async (req, res, next) => {
    try {
      const therapist = await Therapist.findOne({ user: req.user.id }).select('+password');
    //   const user = await User.findById(req.user.id).select('+password');
  
      if (!therapist) {
        return res.status(404).json({ success: false, message: 'Therapist profile not found' });
      }

    //   if (!user) {
    //     return res.status(404).json({ success: false, message: 'User not found' });
    //   }
  
      const updates = { ...req.body };
  
      // Therapist-specific restrictions
      if (req.user.role === 'therapist') {
        delete updates.name;
        delete updates.email;
        delete updates.password;
        delete updates.phoneNumber;
        delete updates.state;
        delete updates.role;
  
        if (therapist.state === 'verified') {
          delete updates.licenseNumber;
          delete updates.workingInfo;
          delete updates.notAvailableDays;
        }
      }
  
      therapist.set(updates);
      await therapist.save();
  
    //   user.set(updates);
    //   await user.save();
  
      res.status(200).json({ success: true, data: therapist });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  };
  
// exports.updateTherapist = async (req, res, next) => {
//     try {
//         let therapist = await Therapist.findById(req.user.id).select('+password');
//         let user = await User.findById(req.user.id).select('+password');

//         if (!therapist || therapist.role !== 'therapist') {
//             return res.status(404).json({ success: false, message: 'Therapist not found' });
//         }

//         const updates = { ...req.body };

//         // Therapist-specific restrictions
//         if (req.user.role === 'therapist') {
//             // Cannot update state or role
//             delete updates.state;
//             delete updates.role;

//             if (therapist.state === 'verified') {
//                 // Cannot update licenseNumber, workingInfo, or notAvailableDays if verified
//                 delete updates.licenseNumber;
//                 delete updates.workingInfo;
//                 delete updates.notAvailableDays;
//             }
//         }

//         therapist.set(updates);
//         await therapist.save();

//         user.set(updates);
//         await user.save();

//         res.status(200).json({ success: true, data: therapist });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ success: false, message: 'Server Error' });
//     }
// };