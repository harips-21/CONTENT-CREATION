"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const generateController_1 = require("../controllers/generateController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/', authMiddleware_1.authenticateToken, generateController_1.generateContent);
router.put('/regenerate', authMiddleware_1.authenticateToken, generateController_1.regenerateFormat);
exports.default = router;
