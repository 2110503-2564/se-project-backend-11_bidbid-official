const Therapist = require("../models/Therapist");
const User = require("../models/User");
const Reservation = require("../models/Reservation"); // Import the Appointment model

// @desc Get therapist profile by ID
// @route GET /api/v1/therapists/:id
// @access Private (therapist can access their own, admin can access all)
exports.getTherapist = async (req, res, next) => {
  try {
    const therapist = await Therapist.findById(req.params.id).populate("user");
    // const therapist = await Therapist.findById(req.params.id);

    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: "Therapist profile not found",
      });
    }

    const therapistUserId =
      therapist.user?._id?.toString?.() || therapist.user?.toString?.();
    // const isOwner = therapist.user?.toString?.() === req.user.id?.toString?.();
    const isOwner = therapistUserId === req.user.id?.toString?.();
    const isAdmin = req.user.role === "admin";

    console.log("therapist.user:", therapist.user);
    console.log("req.user.id:", req.user.id);
    console.log("isOwner:", isOwner);
    console.log("isAdmin:", isAdmin);

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this profile",
      });
    }

    res.status(200).json({
      success: true,
      data: therapist,
    });
  } catch (err) {
    console.error("getTherapist error:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
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
      return res
        .status(404)
        .json({ success: false, message: "Therapist not found" });
    }

    const user = await User.findById(therapist.user);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isOwner = req.user.id === therapist.user.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this profile",
      });
    }

    const updates = { ...req.body };

    // Restrictions for self-updatherapistte
    if (!isAdmin) {
      delete updates.role;

      // Allow rejected therapists to set state to 'pending'
      if (therapist.state !== "rejected") {
        delete updates.state;
      }

      if (therapist.state === "verified") {
        delete updates.licenseNumber;
        delete updates.workingInfo;
        delete updates.notAvailableDays;
      }
    }

    const allowedTherapistFields = [
      "gender",
      "age",
      "experience",
      "specialities",
      "licenseNumber",
      "notAvailableDays",
      "workingInfo",
      "massageShopID",
      "massageShop_name",
      "state",
      "comment",
    ];

    allowedTherapistFields.forEach((field) => {
      if (updates[field] !== undefined) {
        therapist[field] = updates[field];
      }
    });

    await therapist.save();

    // User updates (including password)
    const allowedUserFields = ["name", "email", "phoneNumber", "password"];
    allowedUserFields.forEach((field) => {
      if (updates[field] !== undefined) {
        user[field] = updates[field];
      }
    });

    await user.save(); // password will be hashed in pre-save hook

    res.status(200).json({
      success: true,
      data: therapist,
    });
  } catch (err) {
    console.error("Update therapist error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get all pending therapist profiles
// @route   GET /api/v1/therapists
// @access  Private (admin only)
exports.getPendingTherapists = async (req, res, next) => {
  try {
    const pendingTherapists = await Therapist.find({
      state: "pending",
    }).populate("user");

    res.status(200).json({
      success: true,
      therapists: pendingTherapists,
    });
  } catch (err) {
    console.error("Get pending therapists error:", err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching pending therapists" });
  }
};

// @desc    PUT changes therapist state to verified
// @route   PUT /api/v1/therapists/verified/:id
// @access  Private (admin only)
exports.verifyTherapist = async (req, res, next) => {
  try {
    const therapist = await Therapist.findById(req.params.id);

    if (!therapist) {
      return res
        .status(404)
        .json({ success: false, message: "Therapist not found" });
    }

    therapist.state = "verified";

    await therapist.save();

    res
      .status(200)
      .json({ success: true, message: "Therapist verified successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Therapist verified error" });
  }
};

// @desc    PUT changes therapist state to rejected
// @route   PUT /api/v1/therapists/rejected/:id
// @access  Private (admin only)
exports.rejectTherapist = async (req, res, next) => {
  try {
    const therapist = await Therapist.findById(req.params.id);

    if (!therapist) {
      return res
        .status(404)
        .json({ success: false, message: "Therapist not found" });
    }

    therapist.state = "rejected";
    therapist.comment = req.body.comment || "";
    
    await therapist.save();

    res
      .status(200)
      .json({ success: true, message: "Therapist rejected successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Therapist rejected fail" });
  }
};

// @desc    Get all therapists (optionally filtered by state)
// @route   GET /api/v1/therapists
// @access  Private (admin only, or public if needed)
exports.getTherapists = async (req, res, next) => {
  try {
    // Optional query filtering
    const queryObj = {};
    if (req.query.state) {
      queryObj.state = req.query.state;
    }

    const therapists = await Therapist.find(queryObj).populate("user");

    res.status(200).json({
      success: true,
      count: therapists.length,
      data: therapists,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all verified therapist profiles
// @route   GET /api/v1/therapists/verified
// @access  Public (anyone can view)
exports.getVerifiedTherapists = async (req, res, next) => {
  try {
    const verifiedTherapists = await Therapist.find({
      state: "verified",
    }).populate("user");

    res.status(200).json({
      success: true,
      therapists: verifiedTherapists,
    });
  } catch (err) {
    console.error("Get verified therapists error:", err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching pending therapists" });
  }
};


// @desc    Get all rejected therapist profiles
// @route   GET /api/v1/therapists/rejected
// @access  Private (admin only)
exports.getRejectedTherapists = async (req, res, next) => {
  try {
    const rejectedTherapists = await Therapist.find({
      state: "rejected",
    }).populate("user");

    res.status(200).json({
      success: true,
      therapists: rejectedTherapists,
    });
  } catch (err) {
    console.error("Get rejected therapists error:", err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching pending therapists" });
  }
};

// @desc    Remove therapist profile and change associated user's role to "user"
// @route   DELETE /api/v1/therapists/:id
// @access  Private (therapist owner หรือ admin)
exports.removeTherapist = async (req, res, next) => {
  try {
    const therapist = await Therapist.findById(req.params.id);
    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: "Therapist not found",
      });
    }

    const therapistUserId =
      therapist.user?._id?.toString() || therapist.user?.toString();

    const isOwner = therapistUserId === req.user.id?.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      console.log(isAdmin);
      return res.status(403).json({
        success: false,
        message: "Not authorized to remove this therapist",
      });
    }

    await User.findByIdAndDelete(therapistUserId);

    await Therapist.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Therapist removed successfully and role updated to user",
    });
  } catch (err) {
    console.error("removeTherapist error:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* exports.getTherapistReservations = async (req, res, next) => {
  try {
    // Ensure the user is a therapist
    if (req.user.role !== "therapist") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access appointments",
      });
    }

    // Fetch appointments for the logged-in therapist
    const therapist = await Therapist.findOne({ user: req.user.id });
    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: "Therapist profile not found",
      });
    }
    const reservations = await Reservation.find({therapist: therapist._id});
    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (err) {
    console.error("getTherapistAppointments error:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}; */
exports.getTherapistReservations = async (req, res, next) => {
  try {
    if (req.user.role !== "therapist") {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }
    // find this therapist profile
    const therapist = await Therapist.findOne({ user: req.user.id });
    if (!therapist) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }
    // pull their reservations, populating nested refs
    const reservations = await Reservation.find({ therapist: therapist._id })
      .populate({ path: "user", select: "name" })
      .populate({ path: "massageShop", select: "name" });
    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Add an unavailable time slot for a therapist
// @route   POST /api/v1/therapists/:id/unavailable-times
// @access  Private (admin only)
exports.addUnavailableTimeSlot = async (req, res, next) => {
  try {
    const { day, startTime, endTime } = req.body;

    if (!day || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "day, startTime, and endTime are required",
      });
    }

    const therapist = await Therapist.findById(req.params.id);
    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: "Therapist not found",
      });
    }

    // Validate overlapping time slots
    const overlapping = therapist.UnavailableTimeSlot.some((slot) => {
      return (
        slot.day === day &&
        ((startTime >= slot.startTime && startTime < slot.endTime) ||
          (endTime > slot.startTime && endTime <= slot.endTime) ||
          (startTime <= slot.startTime && endTime >= slot.endTime))
      );
    });

    if (overlapping) {
      return res.status(400).json({
        success: false,
        message: "Time slot overlaps with an existing unavailable time slot",
      });
    }

    therapist.UnavailableTimeSlot.push({ day, startTime, endTime });
    await therapist.save();

    res.status(201).json({
      success: true,
      data: therapist.UnavailableTimeSlot,
    });
  } catch (err) {
    console.error("addUnavailableTimeSlot error:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Add an unavailable time slot for a therapist
// @route   POST /api/v1/therapists/:id/unavailable-times
// @access  Private (admin only)
exports.addUnavailableTimeSlot = async (req, res, next) => {
  try {
    const { date, day, startTime, endTime } = req.body;

    if (!date || !day || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "date, day, startTime, and endTime are required",
      });
    }

    const therapist = await Therapist.findById(req.params.id);
    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: "Therapist not found",
      });
    }

    // Validate overlapping time slots
    const overlapping = therapist.UnavailableTimeSlot.some((slot) => {
      return (
        slot.date === date &&
        slot.day === day &&
        ((startTime >= slot.startTime && startTime < slot.endTime) ||
          (endTime > slot.startTime && endTime <= slot.endTime) ||
          (startTime <= slot.startTime && endTime >= slot.endTime))
      );
    });

    if (overlapping) {
      return res.status(400).json({
        success: false,
        message: "Time slot overlaps with an existing unavailable time slot",
      });
    }

    therapist.UnavailableTimeSlot.push({ date, day, startTime, endTime });
    await therapist.save();

    res.status(201).json({
      success: true,
      data: therapist.UnavailableTimeSlot,
    });
  } catch (err) {
    console.error("addUnavailableTimeSlot error:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Update an unavailable time slot for a therapist
// @route   PUT /api/v1/therapists/:id/unavailable-times/:slotId
// @access  Private (admin only)
exports.updateUnavailableTimeSlot = async (req, res, next) => {
  try {
    const { date, day, startTime, endTime } = req.body;

    const therapist = await Therapist.findById(req.params.id);
    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: "Therapist not found",
      });
    }

    const slot = therapist.UnavailableTimeSlot.id(req.params.slotId);
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Unavailable time slot not found",
      });
    }

    if (date) slot.date = date;
    if (day) slot.day = day;
    if (startTime) slot.startTime = startTime;
    if (endTime) slot.endTime = endTime;

    await therapist.save();

    res.status(200).json({
      success: true,
      data: therapist.UnavailableTimeSlot,
    });
  } catch (err) {
    console.error("updateUnavailableTimeSlot error:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Delete an unavailable time slot for a therapist
// @route   DELETE /api/v1/therapists/:id/unavailable-times/:slotId
// @access  Private (admin only)
exports.deleteUnavailableTimeSlot = async (req, res, next) => {
  try {
    const therapist = await Therapist.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { UnavailableTimeSlot: { _id: req.params.slotId } },
      },
      { new: true }
    );

    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: "Therapist not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Unavailable time slot deleted",
    });
  } catch (err) {
    console.error("deleteUnavailableTimeSlot error:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// // @desc    Delete an unavailable time slot for a therapist
// // @route   DELETE /api/v1/therapists/:id/unavailable-times/:slotId
// // @access  Private (admin only)
// exports.deleteUnavailableTimeSlot = async (req, res, next) => {
//   try {
//     const therapist = await Therapist.findById(req.params.id);
//     if (!therapist) {
//       return res.status(404).json({
//         success: false,
//         message: "Therapist not found",
//       });
//     }

//     const slot = therapist.UnavailableTimeSlot.id(req.params.slotId);
//     if (!slot) {
//       return res.status(404).json({
//         success: false,
//         message: "Unavailable time slot not found",
//       });
//     }

//     slot.remove();
//     await therapist.save();

//     res.status(200).json({
//       success: true,
//       message: "Unavailable time slot deleted",
//     });
//   } catch (err) {
//     console.error("deleteUnavailableTimeSlot error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };
// @desc    Get all unavailable time slots for a therapist
// @route   GET /api/v1/therapists/:id/unavailable-times
// @access  Private (admin only)
exports.getUnavailableTimeSlots = async (req, res, next) => {
  try {
    const therapist = await Therapist.findById(req.params.id);
    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: "Therapist not found",
      });
    }

    res.status(200).json({
      success: true,
      data: therapist.UnavailableTimeSlot,
    });
  } catch (err) {
    console.error("getUnavailableTimeSlots error:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get therapists available on a specific date, day, time, and massage shop
// @route   GET /api/v1/therapists/available?date=2025-05-01&day=Monday&startTime=10:00&endTime=12:00&massageShop=shopId
// @access  Public
exports.getAvailableTherapists = async (req, res, next) => {
  try {
    const { date, day, startTime, endTime, massageShop } = req.query;

    if (!massageShop) {
      return res.status(400).json({
        success: false,
        message: "massageShop is required",
      });
    }

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "date is required",
      });
    }

    if (!day || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "day, startTime, and endTime are required",
      });
    }

    // Build the query object
    const query = {
      notAvailableDays: { $ne: day }, // Exclude therapists unavailable on the given day
      UnavailableTimeSlot: {
        $not: {
          $elemMatch: {
            date: date,
            day: day,
            $or: [
              { startTime: { $lte: startTime }, endTime: { $gt: startTime } },
              { startTime: { $lt: endTime }, endTime: { $gte: endTime } },
              { startTime: { $gte: startTime }, endTime: { $lte: endTime } },
            ],
          },
        },
      },
      state: "verified", // Only include verified therapists
      "workingInfo.massageShopID": massageShop, // Filter by massage shop
    };

    // Find therapists matching the query
    const therapists = await Therapist.find(query).populate("user");

    res.status(200).json({
      success: true,
      count: therapists.length,
      data: therapists,
    });
  } catch (err) {
    console.error("getAvailableTherapists error:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};