const express= require('express');
const {register, login, getMe, logout}=require('../controllers/auth');

const router=express.Router ();

const {protect}= require('../middleware/auth');

router.post('/register', register);
router.post('/login',login);
router.get('/me',protect,getMe);
router.get('/logout',logout);


module.exports=router;

//swagger

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The authentication managing API
 */


/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user (or therapist).
 *     tags: [Auth]
 *     description: This endpoint allows users to register either as a regular user or therapist.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     description: Login endpoint for returning a JWT token upon successful login.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 */
