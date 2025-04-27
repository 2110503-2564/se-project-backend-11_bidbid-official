const express = require("express");
const {
  getTherapist,
  getTherapists,
  getVerifiedTherapists,
  updateTherapist,
  getPendingTherapists,
  verifyTherapist,
  rejectTherapist,
  removeTherapist,
  getTherapistAppointments,
  getTherapistReservations,
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

router.route("/")
    .get(protect, authorize("admin"), getTherapists);
  
router
  .route("/me/reservations")
  .get(protect, authorize("therapist"), getTherapistReservations);

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
 * /therapists:
 *   get:
 *     summary: Get all therapists
 *     description: Retrieve a list of all therapists available.
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
 * /therapists/{id}:
 *   get:
 *     summary: Get a therapist by ID
 *     description: Retrieve detailed information about a specific therapist.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the therapist
 *         required: true
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
 *     summary: Update therapist details
 *     description: Update therapist's information like gender, experience, etc.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the therapist
 *         required: true
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
 *         description: Invalid data
 *       404:
 *         description: Therapist not found
 */

/**
 * @swagger
 * /therapists/{id}:
 *   delete:
 *     summary: Delete a therapist
 *     description: Delete a therapist's profile from the system.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the therapist
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Therapist deleted
 *       404:
 *         description: Therapist not found
 */
