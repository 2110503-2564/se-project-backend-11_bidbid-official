const mongoose = require('mongoose');

const MassageShopSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: [true,'Please add a name'],
        unique: true,
        trim:true,
        maxlength:[50,'Name can not be more than 50 characters']
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    priceRange: {
        type: String,
        required: [true, 'Please add a price range']
    },
    phoneNumber: {
        type: String
    },
    openTime: {
        type: String,
        required: [true, 'Please add opening time']
    },
    closeTime: {
        type: String,
        required: [true, 'Please add closing time']
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

//Reverse populate with virtuals
MassageShopSchema.virtual('reservations', {
    ref: 'Reservation', 
    localField: '_id',
    foreignField: 'massageShop',
    justOne: false
});

module.exports=mongoose.model('MassageShop', MassageShopSchema);