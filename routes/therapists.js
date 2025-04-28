const express = require("express");
const {
  getTherapist,
  getTherapists,
  getVerifiedTherapists,
  getRejectedTherapists,
  updateTherapist,
  getPendingTherapists,
  verifyTherapist,
  rejectTherapist,
  removeTherapist,
  getTherapistReservations,
  addUnavailableTimeSlot,
  getUnavailableTimeSlots,
  deleteUnavailableTimeSlot,
  updateUnavailableTimeSlot,
  getAvailableTherapists,
} = require("../controllers/therapists");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

//Therapist status routes
router.route("/pending")
    .get(protect, authorize("admin"), getPendingTherapists);

router.route("/verify/:id")
    .put(protect, authorize("admin"), verifyTherapist);

router.route("/reject/:id")
    .put(protect, authorize("admin"), rejectTherapist);

router
  .route("/verified")
  .get(getVerifiedTherapists);

router
  .route("/rejected")
  .get(protect, authorize("admin"), getRejectedTherapists);

router.route("/")
    .get(protect, authorize("admin"), getTherapists);
  
router
  .route("/me/reservations")
  .get(protect, authorize("therapist"), getTherapistReservations);

router
  .route("/:id/unavailable-times")
  .post(protect, authorize("admin"), addUnavailableTimeSlot)
  .get(protect, authorize("admin"), getUnavailableTimeSlots);

router
  .route("/:id/unavailable-times/:slotId")
  .put(protect, authorize("admin"), updateUnavailableTimeSlot)
  .delete(protect, authorize("admin"), deleteUnavailableTimeSlot);

  router.route("/available").get(getAvailableTherapists);

router
  .route("/:id")
  .get(protect, getTherapist)
  .put(protect, updateTherapist)
  .delete(protect, authorize("admin"), removeTherapist);
// .get(protect, authorize('therapist', 'admin'), getTherapist)
// .put(protect, authorize('therapist', 'admin'), updateTherapist)

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Therapists
 *   description: API for managing therapists
 */

/**
 * @swagger
 * /therapists:
 *   get:
 *     summary: Get all therapists
 *     tags: [Therapists]
 *     description: Admin only - Retrieve a list of all therapists.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of therapists
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Therapist'
 */

/**
 * @swagger
 * /therapists/verified:
 *   get:
 *     summary: Get all verified therapists
 *     tags: [Therapists]
 *     description: Public - Retrieve a list of verified therapists.
 *     responses:
 *       200:
 *         description: List of verified therapists
 */

/**
 * @swagger
 * /therapists/rejected:
 *   get:
 *     summary: Get all rejected therapists (admin only)
 *     tags: [Therapists]
 *     description: Admin only - Retrieve a list of rejected therapists.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of rejected therapists
 */

/**
 * @swagger
 * /therapists/pending:
 *   get:
 *     summary: Get pending therapists (admin only)
 *     tags: [Therapists]
 *     description: Admin only - Retrieve a list of therapists pending verification.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending therapists
 */

/**
 * @swagger
 * /therapists/available:
 *   get:
 *     summary: Get available therapists
 *     tags: [Therapists]
 *     description: Public - Retrieve a list of therapists available for booking.
 *     responses:
 *       200:
 *         description: List of available therapists
 */

/**
 * @swagger
 * /therapists/me/reservations:
 *   get:
 *     summary: Get therapist's own reservations
 *     tags: [Therapists]
 *     description: Therapist only - Retrieve their own reservations.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of therapist's reservations
 */

/**
 * @swagger
 * /therapists/{id}:
 *   get:
 *     summary: Get therapist by ID
 *     tags: [Therapists]
 *     description: Retrieve detailed information about a therapist.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Therapist ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Therapist details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Therapist'
 *       404:
 *         description: Therapist not found
 */

/**
 * @swagger
 * /therapists/{id}:
 *   put:
 *     summary: Update therapist profile
 *     tags: [Therapists]
 *     description: Therapist updates their own profile.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Therapist ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Therapist'
 *     responses:
 *       200:
 *         description: Therapist updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Therapist not found
 */

/**
 * @swagger
 * /therapists/{id}:
 *   delete:
 *     summary: Delete therapist (admin only)
 *     tags: [Therapists]
 *     description: Admin only - Delete a therapist's profile.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Therapist deleted
 *       404:
 *         description: Therapist not found
 */

/**
 * @swagger
 * /therapists/verify/{id}:
 *   put:
 *     summary: Verify a therapist (admin only)
 *     tags: [Therapists]
 *     description: Admin only - Verify a therapist profile and change their status to verified.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Therapist ID
 *     responses:
 *       200:
 *         description: Therapist verified
 *       404:
 *         description: Therapist not found
 */

/**
 * @swagger
 * /therapists/reject/{id}:
 *   put:
 *     summary: Reject a therapist (admin only)
 *     tags: [Therapists]
 *     description: Admin only - Reject a therapist profile and optionally add a rejection comment.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Therapist ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 example: "Incomplete documents"
 *     responses:
 *       200:
 *         description: Therapist rejected
 *       404:
 *         description: Therapist not found
 */

/**
 * @swagger
 * /therapists/{id}/unavailable-times:
 *   post:
 *     summary: Add unavailable time slot (admin only)
 *     tags: [Therapists]
 *     description: Admin only - Add a new unavailable time slot for a therapist.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Therapist ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *                 example: "13:00"
 *     responses:
 *       201:
 *         description: Unavailable slot added
 */

/**
 * @swagger
 * /therapists/{id}/unavailable-times:
 *   get:
 *     summary: Get unavailable time slots (admin only)
 *     tags: [Therapists]
 *     description: Admin only - Retrieve unavailable time slots of a therapist.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Therapist ID
 *     responses:
 *       200:
 *         description: List of unavailable times
 */

/**
 * @swagger
 * /therapists/{id}/unavailable-times/{slotId}:
 *   put:
 *     summary: Update unavailable time slot (admin only)
 *     tags: [Therapists]
 *     description: Admin only - Update a specific unavailable time slot.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: slotId
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
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *     responses:
 *       200:
 *         description: Unavailable slot updated
 */

/**
 * @swagger
 * /therapists/{id}/unavailable-times/{slotId}:
 *   delete:
 *     summary: Delete unavailable time slot (admin only)
 *     tags: [Therapists]
 *     description: Admin only - Delete a specific unavailable time slot.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: slotId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Unavailable slot deleted
 */