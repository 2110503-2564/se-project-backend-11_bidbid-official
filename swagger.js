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
      schemas: {
        RegisterRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            phoneNumber: { type: 'string', example: '+1234567890' },
            password: { type: 'string', format: 'password', example: 'P@ssw0rd' },
            role: { type: 'string', enum: ['user', 'therapist'], example: 'user' },
            age: { type: 'integer', example: 30 },
            gender: { type: 'string', example: 'male' },
            experience: { type: 'string', example: '5 years' },
            specialities: { type: 'array', items: { type: 'string' }, example: ['Thai massage', 'Deep tissue'] },
            licenseNumber: { type: 'string', example: 'LIC123456' },
            notAvailableDays: { type: 'array', items: { type: 'string', format: 'date' }, example: ['2025-05-01'] },
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
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            phoneNumber: { type: 'string', example: '+1234567890' },
            role: { type: 'string', enum: ['user', 'therapist', 'admin'], example: 'user' },
            createdAt: { type: 'string', format: 'date-time', example: '2025-04-27T12:34:56.789Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2025-04-27T12:34:56.789Z' }
          }
        },
        Therapist: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '60d0fe4f5311236168a109cb' },
            user: { $ref: '#/components/schemas/User' },
            gender: { type: 'string', example: 'female' },
            age: { type: 'integer', example: 28 },
            experience: { type: 'string', example: '3 years' },
            specialities: { type: 'array', items: { type: 'string' }, example: ['Swedish','Shiatsu'] },
            licenseNumber: { type: 'string', example: 'LIC654321' },
            notAvailableDays: { type: 'array', items: { type: 'string', format: 'date' }, example: ['2025-05-02'] },
            workingInfo: { type: 'string', example: 'Tue-Sat 10:00-18:00' },
            massageShopID: { type: 'string', example: '60d0fe4f5311236168a109cc' },
            massageShop_name: { type: 'string', example: 'Relax Spa Downtown' },
            verified: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        MassageShop: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '60d0fe4f5311236168a109cd' },
            name: { type: 'string', example: 'Relax Spa Downtown' },
            address: { type: 'string', example: '123 Spa St, Bangkok' },
            phoneNumber: { type: 'string', example: '+6621234567' },
            openTime: { type: 'string', example: '09:00' },
            closeTime: { type: 'string', example: '18:00' },
            picture: { type: 'string', format: 'uri', example: 'http://example.com/image.jpg' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Reservation: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '60d0fe4f5311236168a109ce' },
            reservationDate: { type: 'string', format: 'date', example: '2025-05-03' },
            time: { type: 'string', example: '14:30' },
            duration: { type: 'number', example: 1.5 },
            user: { $ref: '#/components/schemas/User' },
            massageShop: { $ref: '#/components/schemas/MassageShop' },
            therapist: { $ref: '#/components/schemas/Therapist' },
            status: { type: 'string', enum: ['pending','confirmed','completed','cancelled'], example: 'pending' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
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
            therapist: { $ref: '#/components/schemas/Therapist' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
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

module.exports = { swaggerUi, swaggerSpec };
