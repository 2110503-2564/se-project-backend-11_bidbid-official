const Therapist = require('../models/Therapist');

// @desc    Update therapist profile
// @route   PUT /api/v1/therapists/:id
// @access  Private (therapist / admin)
exports.updateTherapistProfile = async (req, res, next) => {
    try {
        const therapist = await Therapist.findById(req.params.id);

        if (!therapist) {
            return res.status(404).json({ success: false, message: 'Therapist not found' });
        }

        const userRole = req.user.role;

        const adminUpdatableFields = [
            'name', 'email', 'phoneNumber', 'gender', 'age',
            'experience', 'specialities', 'state', 'licenseNumber',
            'workingInfo', 'notAvailableDays'
        ];

        const therapistUpdatableFields = [
            'name', 'email', 'phoneNumber', 'gender', 'age',
            'experience', 'specialities'
        ];

        const allowedFields = userRole === 'admin' ? adminUpdatableFields : therapistUpdatableFields;

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                therapist[field] = req.body[field];
            }
        });

        await therapist.save();

        res.status(200).json({
            success: true,
            data: therapist
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
