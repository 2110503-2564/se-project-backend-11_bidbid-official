const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');

dotenv.config({ path: './config/config.env' });

const { swaggerUi, swaggerSpec, swaggerUiOptions } = require('./swagger');

connectDB();

const app = express();

// Middlewares
app.use(cookieParser());
app.use(express.json());

// Fix CORS: allow ALL during development
app.use(cors());

// Import Routes
const auth = require('./routes/auth');
const reservations = require('./routes/reservations');
const massageShops = require('./routes/massageShops');
const reviews = require('./routes/reviews');
const therapists = require('./routes/therapists');

// Routes
app.use('/api/v1/auth', auth);
app.use('/api/v1/reservations', reservations);
app.use('/api/v1/massageShops', massageShops);
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/therapists', therapists);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// Expose raw JSON for Import API (optional but good)
app.get('/api-docs-json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});