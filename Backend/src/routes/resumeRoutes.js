// const express = require("express");
// const router = express.Router();
// const resumeController = require("../controllers/resumeController");

// router.post("/upload", resumeController.uploadResume);
// router.get("/user/:userId", resumeController.getResumeByUser);

// module.exports = router;
const express = require("express");
const router = express.Router();
const resumeController = require("../controllers/resumeController");

router.post("/upload", resumeController.uploadResume);
router.get("/user/:userId", resumeController.getResumeByUser);

module.exports = router;
