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
            _id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            phoneNumber: { type: 'string', example: '0812345678' },
            role: { type: 'string', enum: ['user', 'therapist', 'admin'], example: 'user' },
            createdAt: { type: 'string', format: 'date-time', example: '2025-04-27T12:34:56.789Z' }
          }
        },
        Therapist: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '60d0fe4f5311236168a109cb' },
            user: { $ref: '#/components/schemas/User' },
            gender: { type: 'string', example: 'Female' },
            age: { type: 'string', example: '28' },
            experience: { type: 'number', example: 3 },
            specialities: { type: 'string', example: 'Thai massage, Deep tissue' },
            licenseNumber: { type: 'string', example: 'LIC654321' },
            notAvailableDays: { type: 'array', items: { type: 'string', format: 'date' }, example: ['2025-05-02'] },
            workingInfo: { 
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  massageShopID: { type: 'string', example: '60d0fe4f5311236168a109cc' },
                  massageShop_name: { type: 'string', example: 'Relax Spa Downtown' }
                }
              }
            },
            UnavailableTimeSlot: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  day: { type: 'string', example: 'Monday' },
                  startTime: { type: 'string', example: '09:00' },
                  endTime: { type: 'string', example: '17:00' }
                }
              }
            },
            state: { type: 'string', enum: ['pending', 'verified', 'rejected'], example: 'pending' },
            comment: { type: 'string', example: 'Document expired' },
            createdAt: { type: 'string', format: 'date-time', example: '2025-04-27T12:34:56.789Z' }
          }
        },
        MassageShop: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '60d0fe4f5311236168a109cd' },
            name: { type: 'string', example: 'Relax Spa Downtown' },
            address: { type: 'string', example: '123 Spa St, Bangkok' },
            priceRange: { type: 'string', example: '400' },
            phoneNumber: { type: 'string', example: '021234567' },
            openTime: { type: 'string', example: '09:00' },
            closeTime: { type: 'string', example: '18:00' },
            picture: { type: 'string', format: 'uri', example: 'http://example.com/image.jpg' },
            createdAt: { type: 'string', format: 'date-time', example: '2025-04-27T12:34:56.789Z' }
          }
        },
        Reservation: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '60d0fe4f5311236168a109ce' },
            massageShop: { $ref: '#/components/schemas/MassageShop' },
            user: { $ref: '#/components/schemas/User' },
            date: { type: 'string', format: 'date', example: '2025-05-03' },
            time: { type: 'string', example: '14:30' },
            duration: { type: 'number', example: 1.5 },
            massageProgram: { type: 'string', example: 'Thai Massage' },
            therapist: { $ref: '#/components/schemas/Therapist' },
            createdAt: { type: 'string', format: 'date-time', example: '2025-04-27T12:34:56.789Z' }
          }
        },
        Review: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '60d0fe4f5311236168a109cf' },
            rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
            comment: { type: 'string', example: 'Excellent service!' },
            user: { $ref: '#/components/schemas/User' },
            massageShop: { $ref: '#/components/schemas/MassageShop' },
            createdAt: { type: 'string', format: 'date-time', example: '2025-04-27T12:34:56.789Z' }
          }
        },
        RegisterRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            phoneNumber: { type: 'string', example: '0812345678' },
            password: { type: 'string', format: 'password', example: 'P@ssw0rd' },
            role: { type: 'string', enum: ['user', 'therapist'], example: 'user' },
            age: { type: 'string', example: '30' },
            gender: { type: 'string', example: 'Male' },
            experience: { type: 'number', example: 5 },
            specialities: { type: 'string', example: 'Thai massage, Deep tissue' },
            licenseNumber: { type: 'string', example: 'LIC123456' },
            notAvailableDays: { type: 'array', items: { type: 'string' }, example: ['2025-05-01'] },
            workingInfo: { type: 'string', example: 'Mon-Fri 9:00-17:00' },
            massageShopID: { type: 'string', example: '60d0fe4f5311236168a109ca' },
            massageShop_name: { type: 'string', example: 'Relax Spa' }
          },
          required: ['name', 'email', 'phoneNumber', 'password', 'role']
        },
        LoginRequest: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', format: 'password', example: 'P@ssw0rd' }
          },
          required: ['email', 'password']
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            role: { type: 'string', example: 'user' },
            token: { type: 'string', example: 'eyJhbGciOi...' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'Resource not found' }
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