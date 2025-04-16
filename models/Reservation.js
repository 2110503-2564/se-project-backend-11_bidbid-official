const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    massageShop: {
        type: String,
        ref: 'MassageShop',
        required: true
    },
    userID: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    user_name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    massageProgram: {
        type: String,
        required: true
    },
    therapistID:{
        type:String,
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Reservation', ReservationSchema);


// const mongoose = require('mongoose');

// const ReservationSchema = new mongoose.Schema({
//     reservationDate: {
//         type: Date,
//         required: true
//     },
//     user: {
//         type: mongoose.Schema.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     massageShop: {
//         type: mongoose.Schema.ObjectId,
//         ref: 'MassageShop',
//         required: true
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// module.exports = mongoose.model('Reservation', ReservationSchema);
