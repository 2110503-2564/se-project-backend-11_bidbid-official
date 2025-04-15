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
// @desc Update therapist profile (admin or owner)
// @route PUT /api/v1/therapists/:id
// @access Private
exports.updateTherapist = async (req, res, next) => {
  try {
    const therapistId = req.params.id;

    const therapist = await Therapist.findById(therapistId);
    if (!therapist) {
      return res.status(404).json({ success: false, message: 'Therapist not found' });
    }

    const user = await User.findById(therapist.user);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isOwner = req.user.id === therapist.user.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this profile' });
    }

    const updates = { ...req.body };

    // Restrictions for self-update
    if (!isAdmin) {
      delete updates.role;
      delete updates.state;

      if (therapist.state === 'verified') {
        delete updates.licenseNumber;
        delete updates.workingInfo;
        delete updates.notAvailableDays;
      }
    }

    // ✅ Therapist updates
    const allowedTherapistFields = [
      'gender', 'age', 'experience', 'specialities',
      'licenseNumber', 'notAvailableDays', 'workingInfo',
      'massageShopID', 'massageShop_name'
    ];

    allowedTherapistFields.forEach((field) => {
      if (updates[field] !== undefined) {
        therapist[field] = updates[field];
      }
    });

    await therapist.save();

    // User updates (including password)
    const allowedUserFields = ['name', 'email', 'phoneNumber', 'password'];
    allowedUserFields.forEach((field) => {
      if (updates[field] !== undefined) {
        user[field] = updates[field];
      }
    });

    await user.save(); // password will be hashed in pre-save hook

    res.status(200).json({ success: true, data: therapist });
  } catch (err) {
    console.error("Update therapist error:", err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// exports.updateTherapist = async (req, res, next) => {
//   try {
//     const therapistId = req.params.id;

//     let therapist = await Therapist.findById(therapistId);
//     if (!therapist) {
//       return res.status(404).json({ success: false, message: 'Therapist not found' });
//     }

//     const user = await User.findById(therapist.user);
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'Linked user not found' });
//     }

//     // Check if requester is the owner OR admin
//     const isOwner = req.user.id === therapist.user.toString();
//     const isAdmin = req.user.role === 'admin';

//     if (!isOwner && !isAdmin) {
//       return res.status(403).json({ success: false, message: 'Not authorized to update this profile' });
//     }

//     const updates = { ...req.body };

//     // Therapist-specific restrictions (only for role = therapist)
//     if (!isAdmin) {
//       delete updates.name;
//       delete updates.email;
//       delete updates.password;
//       delete updates.phoneNumber;
//       delete updates.state;
//       delete updates.role;

//       if (therapist.state === 'verified') {
//         delete updates.licenseNumber;
//         delete updates.workingInfo;
//         delete updates.notAvailableDays;
//       }
//     }

//     therapist.set(updates);
//     await therapist.save();

//     // Update user fields if applicable
//     const allowedUserFields = ['name', 'email', 'phoneNumber'];
//     allowedUserFields.forEach((field) => {
//       if (updates[field]) {
//         user[field] = updates[field];
//       }
//     });
//     await user.save();

//     res.status(200).json({ success: true, data: therapist });
//   } catch (err) {
//     console.error("Update therapist error:", err);
//     res.status(500).json({ success: false, message: 'Server Error' });
//   }
// };
