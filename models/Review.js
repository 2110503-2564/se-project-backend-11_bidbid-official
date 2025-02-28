const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: false
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    massageShop: {
        type: mongoose.Schema.ObjectId,
        ref: 'MassageShop',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Calculate average rating for a shop
ReviewSchema.statics.getAverageRating = async function(shopId) {
    const obj = await this.aggregate([
        { $match: { massageShop: shopId } },
        { $group: { _id: '$massageShop', averageRating: { $avg: '$rating' } } }
    ]);

    try {
        await mongoose.model('MassageShop').findByIdAndUpdate(shopId, {
            averageRating: obj.length > 0 ? obj[0].averageRating : 0
        });
    } catch (err) {
        console.error(err);
    }
};

// Update the rating whenever a review is added
ReviewSchema.post('save', function() {
    this.constructor.getAverageRating(this.massageShop);
});

module.exports = mongoose.model('Review', ReviewSchema);
