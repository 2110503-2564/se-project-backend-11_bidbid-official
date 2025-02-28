const Review = require('../models/Review');
const MassageShop = require('../models/MassageShop');

//@desc Get all reviews
//@route GET /api/v1/reviews
//@access Public
exports.getReviews = async (req, res, next) => {
    try {
        let query;

        if (req.params.massageShopId) {
            query = Review.find({ massageShop: req.params.massageShopId });
        } else {
            query = Review.find().populate({
                path: 'massageShop',
                select: 'name address'
            });
        }

        const reviews = await query;

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Cannot fetch reviews" });
    }
};

//@desc Get a single review
//@route GET /api/v1/reviews/:id
//@access Public
exports.getReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id).populate({
            path: 'massageShop',
            select: 'name address'
        });

        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        res.status(200).json({ success: true, data: review });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Cannot fetch review" });
    }
};

//@desc Add a review
//@route POST /api/v1/massageShops/:massageShopId/reviews
//@access Private (User)
exports.addReview = async (req, res, next) => {
    try {
        req.body.massageShop = req.params.massageShopId;
        req.body.user = req.user.id;

        // Check if the massage shop exists
        const massageShop = await MassageShop.findById(req.params.massageShopId);
        if (!massageShop) {
            return res.status(404).json({ success: false, message: "Massage shop not found" });
        }

        // Check if the user has already reviewed this massage shop
        const existingReview = await Review.findOne({ 
            user: req.user.id, 
            massageShop: req.params.massageShopId 
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: `You already reviewed this shop: ${massageShop.name}`
            });
        }

        // Create a new review
        const review = await Review.create(req.body);

        res.status(201).json({
            success: true,
            data: review
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Cannot add review" });
    }
};


//@desc Update a review
//@route PUT /api/v1/reviews/:id
//@access Private (User/Admin)
exports.updateReview = async (req, res, next) => {
    try {
        let review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        // Allow review owner or admin to update
        if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: "Not authorized to update this review" });
        }

        // Update only allowed fields
        if (req.body.rating) review.rating = req.body.rating;
        if (req.body.comment) review.comment = req.body.comment;

        await review.save(); 

        res.status(200).json({
            success: true,
            data: review
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Cannot update review" });
    }
};


//@desc Delete a review
//@route DELETE /api/v1/reviews/:id
//@access Private (User/Admin)
exports.deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        // Ensure the user owns the review or is an admin
        if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: "Not authorized to delete this review" });
        }

        await review.deleteOne({ _id: req.params.id });

        res.status(200).json({ success: true, message: "Review deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Cannot delete review" });
    }
};
