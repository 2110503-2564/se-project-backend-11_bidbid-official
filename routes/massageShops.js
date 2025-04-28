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

//swagger

/**
 * @swagger
 * tags:
 *   name: Massage Shops
 *   description: API for managing massage shops
 */

/**
 * @swagger
 * /massageShops:
 *   get:
 *     summary: Get all massage shops
 *     tags: [Massage Shops]
 *     description: Public - Retrieve a list of all massage shops.
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
 *     summary: Get a massage shop by ID
 *     tags: [Massage Shops]
 *     description: Public - Retrieve detailed information about a specific massage shop.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Massage shop ID
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
 *     summary: Add a new massage shop (admin only)
 *     tags: [Massage Shops]
 *     description: Admin only - Add a new massage shop to the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MassageShop'
 *     responses:
 *       201:
 *         description: Massage shop added successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /massageShops/{id}:
 *   put:
 *     summary: Update an existing massage shop (admin only)
 *     tags: [Massage Shops]
 *     description: Admin only - Update the details of an existing massage shop.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Massage shop ID to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MassageShop'
 *     responses:
 *       200:
 *         description: Massage shop updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Massage shop not found
 */

/**
 * @swagger
 * /massageShops/{id}:
 *   delete:
 *     summary: Delete a massage shop (admin only)
 *     tags: [Massage Shops]
 *     description: Admin only - Delete a massage shop by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Massage shop ID to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Massage shop deleted successfully
 *       404:
 *         description: Massage shop not found
 */
