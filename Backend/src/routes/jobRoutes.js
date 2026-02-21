const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");

router.post("/add", jobController.addJob);
router.get("/all", jobController.getAllJobs);
router.get("/match/:userId", jobController.matchJobs);

module.exports = router;
