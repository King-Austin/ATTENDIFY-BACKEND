
import express from "express";
import { protectedRoute } from "../controllers/authController";
import { fetchAllActivities } from "../controllers/activitiesController";

const router = express.Router();
 

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
router.get("/fetchAllActivities", protectedRoute, fetchAllActivities);
 

export default router;
 