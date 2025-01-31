import express from "express";

import {
  createAcedemicSession,
  deleteAcedemicSession,
  fetchAcedemicSessionByID,
  fetchAllAcedemicSession,
} from "../controllers/acedemicSessionController";

import {
  protectedRoute,
  restrictedRoute,
} from "src/controllers/authController";

const router = express.Router();

/**
 * @swagger
 * /api/v1/acedemicSession/createAcedemicSession:
 *   post:
 *     summary: Create a new academic session
 *     tags: [Academic Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the academic session
 *               start:
 *                 type: string
 *                 format: date-time
 *                 description: Start date of the session
 *               end:
 *                 type: string
 *                 format: date-time
 *                 description: End date of the session
 *     responses:
 *       201:
 *         description: Academic session created successfully
 *       403:
 *         description: Access forbidden
 */
router
  .route("/createAcedemicSession")
  .post(/*protectedRoute, restrictedRoute(["admin"]), */ createAcedemicSession);

/**
 * @swagger
 * /api/v1/acedemicSession/fetchallAcedemicSession:
 *   get:
 *     summary: Fetch all academic sessions
 *     tags: [Academic Sessions]
 *     responses:
 *       200:
 *         description: List of all academic sessions
 *       403:
 *         description: Access forbidden
 */
router.route("/fetchallAcedemicSession").get(fetchAllAcedemicSession);

/**
 * @swagger
 * /api/v1/acedemicSession/deleteAcedemicSession:
 *   delete:
 *     summary: Delete an academic session
 *     tags: [Academic Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionId:
 *                 type: string
 *                 description: ID of the session to delete
 *     responses:
 *       200:
 *         description: Academic session deleted successfully
 *       403:
 *         description: Access forbidden
 */
router
  .route("/deleteAcedemicSession")
  .delete(protectedRoute, restrictedRoute(["admin"]), deleteAcedemicSession);

router.route("/fetchAcedemicSessionByID/:id").get(fetchAcedemicSessionByID);

export default router;
