const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");

router.post("/add", jobController.addJob);
router.get("/all", jobController.getAllJobs);
router.get("/match/:userId", jobController.matchJobs);

router.post("/apply", jobController.applyForJob);
router.get("/applications/recruiter/:recruiterId", jobController.getApplicationsForRecruiter);
router.get("/applications/user/:userId", jobController.getApplicationsForUser);
router.put("/applications/:applicationId/status", jobController.updateApplicationStatus);

module.exports = router;
