const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');

dotenv.config({path: './config/config.env'});

connectDB();

const app=express();

app.use (cookieParser());

app.use (express.json());

const auth = require('./routes/auth');
const reservations = require('./routes/reservations');
const massageShops = require('./routes/massageShops');
const reviews = require('./routes/reviews');

app.use('/api/v1/auth',auth);
app.use('/api/v1/reservations', reservations);
app.use('/api/v1/massageShops', massageShops);
app.use('/api/v1/reviews', reviews);

const PORT=process.env.PORT || 5000;
const server = app.listen (PORT, console.log('Server running in ', process.env.NODE_ENV, ' mode on port ', PORT));

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
})