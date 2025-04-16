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
  .get(protect, authorize("admin"), getVerifiedTherapists);

router.route("/")
    .get(protect, authorize("admin"), getTherapists);

router
  .route("/:id")
  .get(protect, getTherapist)
  .put(protect, updateTherapist)
  .delete(protect, authorize("admin"), removeTherapist);
// .get(protect, authorize('therapist', 'admin'), getTherapist)
// .put(protect, authorize('therapist', 'admin'), updateTherapist)

module.exports = router;
