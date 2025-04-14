const express = require('express');
const { updateTherapistProfile } = require('../controllers/therapists');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.put('/:id', protect, authorize('therapist', 'admin'), updateTherapistProfile);

module.exports = router;
