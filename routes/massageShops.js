const express = require('express');
const { 
    getMassageShops, 
    getMassageShop, 
    createMassageShop, 
    updateMassageShop, 
    deleteMassageShop 
} = require('../controllers/massageShops');

const reservationRouter = require('./reservations');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

const reviews = require('./reviews');

router.use('/:massageShopId/reservations/', reservationRouter);
router.route('/').get(getMassageShops).post(protect, authorize('admin'), createMassageShop);
router.route('/:id').get(getMassageShop).put(protect, authorize('admin'), updateMassageShop).delete(protect, authorize('admin'), deleteMassageShop);
router.use('/:massageShopId/reviews', reviews);

module.exports = router;
/**
 * @swagger
 * /massageShops:
 *   get:
 *     summary: Get all massage shops
 *     description: Retrieve a list of all massage shops available.
 *     responses:
 *       200:
 *         description: List of massage shops
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MassageShop'
 */

/**
 * @swagger
 * /massageShops/{id}:
 *   get:
 *     summary: Get massage shop by ID
 *     description: Retrieve detailed information about a specific massage shop.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the massage shop
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Massage shop details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MassageShop'
 *       404:
 *         description: Massage shop not found
 */

/**
 * @swagger
 * /massageShops:
 *   post:
 *     summary: Add a new massage shop
 *     description: Add a new massage shop to the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MassageShop'
 *     responses:
 *       200:
 *         description: Massage shop added successfully
 *       400:
 *         description: Invalid data
 */

