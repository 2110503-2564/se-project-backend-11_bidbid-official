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
/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Get all reservations
 *     description: Get a list of all reservations.
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
 * /reservations/{id}:
 *   get:
 *     summary: Get reservation by ID
 *     description: Retrieve detailed information about a specific reservation.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the reservation
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reservation details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Reservation not found
 */

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Create a reservation
 *     description: Create a new reservation for a user and therapist.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       200:
 *         description: Reservation created successfully
 *       400:
 *         description: Invalid input data
 */

/**
 * @swagger
 * /reservations/{id}:
 *   put:
 *     summary: Update reservation status
 *     description: Change the status (pending, confirmed, cancelled) of an existing reservation.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the reservation
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ['pending', 'confirmed', 'completed', 'cancelled']
 *     responses:
 *       200:
 *         description: Reservation status updated
 *       404:
 *         description: Reservation not found
 */

/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     summary: Cancel a reservation
 *     description: Delete an existing reservation.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the reservation
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reservation cancelled
 *       404:
 *         description: Reservation not found
 */

