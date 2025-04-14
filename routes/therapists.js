const express = require('express');
const {
    getTherapists,
    getTherapist,
    // addTherapist,
    // updateTherapist,
    // deleteTherapist
} = require('../controllers/therapists');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(getTherapists)
    // .post(protect, authorize('user', 'admin'), addReview);

router.route('/:id')
    .get(getTherapist)
    // .put(protect, authorize('user', 'admin'), updateReview)
    // .delete(protect, authorize('user', 'admin'), deleteReview);

module.exports = router;