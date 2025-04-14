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
    .get(protect, authorize('therapist'), getTherapist)
    .put(protect, authorize('therapist'), updateTherapist);

// Admin route to update any therapist
// router
//     .route('/:id')
//     .put(protect, authorize('admin'), adminUpdateTherapist);

module.exports = router;