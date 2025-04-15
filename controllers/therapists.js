const Therapist = require('../models/Therapist');
const User = require('../models/User');

// @desc Get therapist profile by ID
// @route GET /api/v1/therapists/:id
// @access Private (therapist can access their own, admin can access all)
exports.getTherapist = async (req, res, next) => {
  try {
    // const therapist = await Therapist.findById(req.params.id).populate('user');
    const therapist = await Therapist.findById(req.params.id);

    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: 'Therapist profile not found',
      });
    }

    const isOwner = therapist.user?.toString?.() === req.user.id?.toString?.();
    const isAdmin = req.user.role === 'admin';

    console.log('therapist.user:', therapist.user);
    console.log('req.user.id:', req.user.id); 
    console.log('isOwner:', isOwner);
    console.log('isAdmin:', isAdmin);

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this profile',
      });
    }

    res.status(200).json({
      success: true,
      data: therapist,
    });
  } catch (err) {
    console.error('getTherapist error:', err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
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

    // Restrictions for self-updatherapistte
    if (!isAdmin) {
      delete updates.role;
      delete updates.state;

      if (therapist.state === 'verified') {
        delete updates.licenseNumber;
        delete updates.workingInfo;
        delete updates.notAvailableDays;
      }
    }

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

    res.status(200).json({
      success: true,
      data: therapist
    });
  } catch (err) {
    console.error("Update therapist error:", err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get all pending therapist profiles
// @route   GET /api/v1/therapists
// @access  Private (admin only)
exports.getPendingTherapists = async (req, res, next) => {
  try {
    const pendingTherapists = await Therapist.find({ state: 'pending' }).populate('user');

    res.status(200).json({
      success: true,
      therapists : pendingTherapists
    });
  } catch (err) {
    console.error("Get pending therapists error:", err);
    res.status(500).json({ success: false, message: 'Error fetching pending therapists' });
  }
};

// @desc    PUT changes therapist state to verified
// @route   PUT /api/v1/therapists/verified/:id
// @access  Private (admin only)
exports.verifiedTherapist = async (req, res, next) => {
  try {
    const therapist = await Therapist.findById(req.params.id);

    if (!therapist) {
      return res.status(404).json({ success: false, message: 'Therapist not found' });
    }

    therapist.state = 'verified';

    await therapist.save();

    res.status(200).json({ success: true, message: 'Therapist verified successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Therapist verified error' });
  }
};

// @desc    PUT changes therapist state to rejected
// @route   PUT /api/v1/therapists/rejected/:id
// @access  Private (admin only)
exports.rejectedTherapist = async (req, res, next) => {
  try {
    const therapist = await Therapist.findById(req.params.id);

    if (!therapist) {
      return res.status(404).json({ success: false, message: 'Therapist not found' });
    }

    therapist.state = 'rejected';

    await therapist.save();

    res.status(200).json({ success: true, message: 'Therapist rejected successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Therapist rejected fail' });
  }
};