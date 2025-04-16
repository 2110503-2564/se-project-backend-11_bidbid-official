const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    massageShop: {
        type: mongoose.Schema.ObjectId, 
        ref: 'MassageShop',
        required: true
    },
    // userID: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
    // user_name: {
    //     type: String,
    //     required: true
    // },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
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
    // therapistID:{
    //     type:String,
    //     required:true
    // },
    therapist: {
        type: mongoose.Schema.ObjectId, 
        ref: 'Therapist',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Reservation', ReservationSchema);
