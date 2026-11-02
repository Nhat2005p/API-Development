const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authenticateJWT } = require("../middleware/auth.middleware");

// POST /api/v1/auth/register
router.post("/register", authController.register);

// POST /api/v1/auth/login
router.post("/login", authController.login);

// GET /api/v1/auth/me (Protected Route - Cần Bearer JWT)
router.get("/me", authenticateJWT, authController.getMe);

module.exports = router;
