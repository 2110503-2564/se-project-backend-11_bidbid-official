const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const TherapistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    gender : {
        type: String,
        required: [true, 'Please select a gender'],
        enum: ['Male', 'Female']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please add a phone number'],
        unique: true,
        match: [/^\d{10}$/, 'Phone number must be exactly 10 digits and contain only numbers']
    },
    experience : {
        type: Number,
        min: [0, 'Experience must be at least 0'],
        required: [true, 'Please add year of experience']
    },    
    specialities : {
        type: String,
        required: [true, 'Please add a specialities']
    },
    state : {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'therapist'],
        default: 'therapist'
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    workingInfo: [{
        massageShopID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MassageShop',
            validate: {
                validator: async function(value) {
                    if (value === null || value === undefined) return true; 
                    const shop = await mongoose.model('MassageShop').findById(value);
                    return !!shop;
                },
                message: 'Massage shop not found'
            },
            default: null
        },
        massageShop_name: {
            type: String,
        }
    }],
    notAvailableDays: {
        type: [String], // <-- array of strings
        default: []
    }
});

TherapistSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

TherapistSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
}

TherapistSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

module.exports = mongoose.model('Therapist', TherapistSchema);
