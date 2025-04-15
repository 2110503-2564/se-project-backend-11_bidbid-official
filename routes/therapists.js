const express = require('express');
const {
    getTherapist,
    updateTherapist,
    adminUpdateTherapist
} = require('../controllers/therapists');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Therapist routes
router
    .route('/:id')
    .get(protect, getTherapist)
    .put(protect, updateTherapist)
    // .get(protect, authorize('therapist', 'admin'), getTherapist)
    // .put(protect, authorize('therapist', 'admin'), updateTherapist)


module.exports = router;