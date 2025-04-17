"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const activitiesController_1 = require("../controllers/activitiesController");
const router = express_1.default.Router();
/**
 * @swagger
 * /api/v1/activities/fetchAllActivities:
 *   get:
 *     summary: Fetch all activities records
 *     tags: [Activities]
 *     responses:
 *       200:
 *         description: List of all activities records
 *       403:
 *         description: Access forbidden
 */
router.get("/fetchAllActivities", authController_1.protectedRoute, activitiesController_1.fetchAllActivities);
exports.default = router;
