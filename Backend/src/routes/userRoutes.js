const express = require("express");
const router = express.Router();
const c = require("../controllers/userController");

// IMPORTANT: all handlers MUST exist
router.post("/register", c.register);
router.post("/login", c.login);
router.post("/google-auth", c.googleAuth);
router.get("/all", c.getAllUsers);
router.delete("/delete/:id", c.deleteUser);
router.post("/profile-photo", c.uploadProfilePhoto);
router.get("/profile/:id", c.getUserProfile);
router.put("/profile/:id", c.updateProfile);


module.exports = router;
