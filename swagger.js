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
            _id: { type: 'string', example: '680df6eeb1b5a38cc21b795f' },
            name: { type: 'string', example: 'therapist verified99' },
            email: { type: 'string', format: 'email', example: 'therapistverified99@gmail.com' },
            phoneNumber: { type: 'string', example: '2100000099' },
            role: { type: 'string', enum: ['user', 'therapist', 'admin'], example: 'therapist' },
            createdAt: { type: 'string', format: 'date-time', example: '2025-04-27T09:20:46.164Z' }
          }
        },
        Therapist: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '680df6eeb1b5a38cc21b7961' },
            user: { $ref: '#/components/schemas/User' },
            gender: { type: 'string', example: 'Male' },
            age: { type: 'string', example: '18' },
            experience: { type: 'number', example: 44 },
            specialities: { type: 'string', example: 'rr' },
            licenseNumber: { type: 'string', example: 'V001' },
            notAvailableDays: {
              type: 'array',
              items: { type: 'string' },
              example: ['Tuesday', 'Thursday']
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
            UnavailableTimeSlot: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  day: { type: 'string', example: 'Tuesday' },
                  startTime: { type: 'string', example: '13:00' },
                  endTime: { type: 'string', example: '15:00' }
                }
              }
            },
            state: { type: 'string', enum: ['pending', 'verified', 'rejected'], example: 'verified' },
            comment: { type: 'string', example: '' },
            createdAt: { type: 'string', format: 'date-time', example: '2025-04-27T09:20:46.561Z' }
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
            picture: { type: 'string', format: 'uri', example: 'https://drive.google.com/uc?export=download&id=12QnhAYaEenxBg5W45CPoXXXUMJwFn-lB' }
          }
        },
        Reservation: {
          type: 'object',
          properties: {
            user: { type: 'string', example: '67c01289ea1bf796967fe316' },
            date: { type: 'string', format: 'date-time', example: '2025-04-29T17:00:00.000Z' },
            time: { type: 'string', example: '9:00' },
            duration: { type: 'string', example: '0.5' },
            massageProgram: { type: 'string', example: 'footMassage' },
            therapist: { type: 'string', example: '67fe2e4b8cfd826e3c04cfda' }
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