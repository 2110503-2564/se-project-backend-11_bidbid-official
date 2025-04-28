const express = require('express');
const {
    getReservations,
    getReservation,
    addReservation,
    updateReservation,
    deleteReservation
} = require('../controllers/reservations');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(protect, getReservations)
    .post(protect, authorize('admin', 'user'), addReservation);

router.route('/:id')
    .get(protect, getReservation)
    .put(protect, authorize('admin', 'user'), updateReservation)
    .delete(protect, authorize('admin', 'user'), deleteReservation);

module.exports = router;

// swagger

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: API for managing massage reservations between users and therapists.
 */

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Get all reservations
 *     tags: [Reservations]
 *     description: Retrieve a list of all reservations. Admin can see all; users see their own reservations.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 */

/**
 * @swagger
 * /massageShops/{massageShopID}/reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
 *     description: Create a new reservation for a massage service. Requires authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /reservations/{id}:
 *   get:
 *     summary: Get reservation by ID
 *     tags: [Reservations]
 *     description: Retrieve details of a specific reservation.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Reservation ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reservation details retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Reservation not found
 */

/**
 * @swagger
 * /reservations/{id}:
 *   put:
 *     summary: Update an existing reservation
 *     tags: [Reservations]
 *     description: Update details of a reservation. Users can update their own reservations; admin can update all.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Reservation ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Reservation not found
 */

/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     summary: Delete (cancel) a reservation
 *     tags: [Reservations]
 *     description: Cancel an existing reservation. Users can cancel their own reservations; admin can cancel any.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Reservation ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reservation cancelled successfully
 *       404:
 *         description: Reservation not found
 */
