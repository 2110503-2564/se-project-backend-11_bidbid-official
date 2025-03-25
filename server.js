const express = require('express');
const cors = require('cors')
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');

dotenv.config({path: './config/config.env'});

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const corsOptions = {
  origin: ['http://localhost:3000', 'https://fe-project-2024-2-may-i-scan.vercel.app/'],
  credentials: true,
}

connectDB();

const app=express();

app.use (cookieParser());

app.use (express.json());
// edit
app.use(cors(corsOptions))
// app.use(cors({ origin: 'http://localhost:3000' }))

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

// Swagger
const swaggerOptions={
    swaggerDefinition:{
      openapi: '3.0.0',
      info: {
      title: 'Library API',
      version: '1.0.0',
      description: 'Car Booking API'
      },
      servers: [
        {
          url: 'http://localhost:5000/api/v1'
        }
      ],
    },
    apis:['./routes/*.js'],
  };
const swaggerDocs=swaggerJsDoc(swaggerOptions);
app.use('/api-docs',swaggerUI.serve, swaggerUI.setup(swaggerDocs));


process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
})