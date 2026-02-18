const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");

router.get("/match/:userId", jobController.matchJobs);

module.exports = router;
