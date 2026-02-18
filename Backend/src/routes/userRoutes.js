const express = require("express");
const router = express.Router();
const c = require("../controllers/userController");

// IMPORTANT: all handlers MUST exist
router.post("/register", c.register);
router.post("/login", c.login);
router.get("/all", c.getAllUsers);
router.delete("/delete/:id", c.deleteUser);

module.exports = router;
