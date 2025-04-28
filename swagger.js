const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Massage Shop Reservation API',
      version: '1.0.0',
      description: 'API documentation for the Massage Shop backend (backend-may-i-scan)'
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Local development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '67c01289ealb7f96967fe316' }, // User Doe
            name: { type: 'string', example: 'User Doe' },
            email: { type: 'string', format: 'email', example: 'userdoe@gmail.com' },
            phoneNumber: { type: 'string', example: '1000000001' },
            role: { type: 'string', enum: ['user', 'therapist', 'admin'], example: 'user' },
            createdAt: { type: 'string', format: 'date-time', example: '2025-02-27T07:21:45.904Z' }
          }
        },
        Therapist: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '680df6568c6180695473fdcf' },
            user: { $ref: '#/components/schemas/User' },
            gender: { type: 'string', example: 'Male' },
            age: { type: 'string', example: '19' },
            experience: { type: 'number', example: 1232 },
            specialities: { type: 'string', example: 'dd' },
            licenseNumber: { type: 'string', example: '00000102' },
            notAvailableDays: {
              type: 'array',
              items: { type: 'string' },
              example: ['Monday', 'Wednesday', 'Friday']
            },
            workingInfo: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  massageShopID: { type: 'string', example: '67dd4a99ff5e27d982070fa3' }, // Aroma Haus
                  massageShop_name: { type: 'string', example: 'Aroma Haus' }
                }
              }
            },
            state: { type: 'string', enum: ['pending', 'verified', 'rejected'], example: 'pending' },
            comment: { type: 'string', example: '' },
            createdAt: { type: 'string', format: 'date-time', example: '2025-04-27T09:18:14.685Z' }
          }
        },
        MassageShop: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '67dd4a99ff5e27d982070fa3' },
            name: { type: 'string', example: 'Aroma Haus' },
            address: { type: 'string', example: 'Bangkok' },
            priceRange: { type: 'string', example: '500' },
            phoneNumber: { type: 'string', example: '366-603-8362' },
            openTime: { type: 'string', example: '08.00' },
            closeTime: { type: 'string', example: '20.00' },
            picture: { type: 'string', format: 'uri', example: 'https://drive.google.com/uc?export=download&id=12QnhAYaEenxBg5W45CPoXX' }
          }
        },
        Reservation: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '680fa180b1be8c61afc59bdd' },
            massageShop: { $ref: '#/components/schemas/MassageShop' },
            user: { $ref: '#/components/schemas/User' },
            date: { type: 'string', format: 'date', example: '2025-04-28' },
            time: { type: 'string', example: '13:00' },
            duration: { type: 'number', example: 0.5 },
            massageProgram: { type: 'string', example: 'footMassage' },
            therapist: { $ref: '#/components/schemas/Therapist' },
            createdAt: { type: 'string', format: 'date-time', example: '2025-04-28T15:40:48.106Z' }
          }
        },
        Review: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '660dfe4f5311236168a109cf' },
            rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
            comment: { type: 'string', example: 'Great service and friendly staff.' },
            user: { $ref: '#/components/schemas/User' },
            massageShop: { $ref: '#/components/schemas/MassageShop' },
            createdAt: { type: 'string', format: 'date-time', example: '2025-04-27T12:34:56.789Z' }
          }
        },
        RegisterRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'User Doe' },
            email: { type: 'string', format: 'email', example: 'userdoe@gmail.com' },
            phoneNumber: { type: 'string', example: '1000000001' },
            password: { type: 'string', format: 'password', example: 'P@ssw0rd' },
            role: { type: 'string', enum: ['user', 'therapist'], example: 'user' },
            age: { type: 'string', example: '19' },
            gender: { type: 'string', example: 'Male' },
            experience: { type: 'number', example: 1232 },
            specialities: { type: 'string', example: 'dd' },
            licenseNumber: { type: 'string', example: '00000102' },
            notAvailableDays: {
              type: 'array',
              items: { type: 'string' },
              example: ['Monday', 'Wednesday', 'Friday']
            },
            massageShopID: { type: 'string', example: '67dd4a99ff5e27d982070fa3' },
            massageShop_name: { type: 'string', example: 'Aroma Haus' }
          },
          required: ['name', 'email', 'phoneNumber', 'password', 'role']
        },
        LoginRequest: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email', example: 'userdoe@gmail.com' },
            password: { type: 'string', format: 'password', example: 'P@ssw0rd' }
          },
          required: ['email', 'password']
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            id: { type: 'string', example: '67c01289ealb7f96967fe316' },
            name: { type: 'string', example: 'User Doe' },
            email: { type: 'string', example: 'userdoe@gmail.com' },
            role: { type: 'string', example: 'user' },
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'Unauthorized access.' }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

//auto authorize (didn't sure abt this part yet)
// const swaggerUiOptions = {
//   swaggerOptions: {
//     authAction: {
//       bearerAuth: {
//         name: "bearerAuth",
//         schema: {
//           type: "http",
//           in: "header",
//           name: "Authorization",
//           scheme: "bearer",
//           bearerFormat: "JWT"
//         },
//         value: "Bearer your-token-here"
//       }
//     }
//   }
// };

module.exports = { swaggerUi, swaggerSpec};