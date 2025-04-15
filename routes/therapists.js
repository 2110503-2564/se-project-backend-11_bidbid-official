const express = require('express');
const {
    getTherapist,
    updateTherapist,
    getPendingTherapists,
    verifiedTherapist,
    rejectedTherapist
} = require('../controllers/therapists');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

//Therapist status routes
router
    .route('/pending')
    .get(protect, authorize('admin'), getPendingTherapists);

router
    .route('/verified/:id')
    .put(protect, authorize('admin'), verifiedTherapist)

router
    .route('/rejected/:id')
    .put(protect, authorize('admin'), rejectedTherapist)


// Therapist routes
router
    .route('/:id')
    .get(protect, getTherapist)
    .put(protect, updateTherapist)
    // .get(protect, authorize('therapist', 'admin'), getTherapist)
    // .put(protect, authorize('therapist', 'admin'), updateTherapist)


module.exports = router;