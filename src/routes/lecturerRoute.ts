import express from "express";
import { protectedRoute, restrictedRoute } from "../controllers/authController";
import {
  createALecturer,
  deleteALecturer,
  getAllLecturer,
  getALecturer,
  updateLecturer,
} from "../controllers/lecturerController";

const router = express.Router();

/**
 * @swagger
 * /api/v1/lecturer/createLecturer:
 *   post:
 *     summary: Create a new Lecturer
 *     tags: [Lecturers]
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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Lecturer created successfully
 *       400:
 *         description: Invalid input or validation error
 */
router
  .route("/createLecturer")
  .post(protectedRoute, restrictedRoute(["admin", "lecturer"]), createALecturer);

/**
 * @swagger
 * /api/v1/lecturer/getALecturer:
 *   get:
 *     summary: Get a specific Lecturer
 *     tags: [Lecturers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lecturer data retrieved successfully
 *       404:
 *         description: Lecturer not found
 */
router
  .route("/getALecturer")
  .get(protectedRoute, restrictedRoute(["admin"]), getALecturer);

/**
 * @swagger
 * /api/v1/lecturer/getAllLecturer:
 *   get:
 *     summary: Get all Lecturers
 *     tags: [Lecturers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of Lecturers retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router
  .route("/getAllLecturer")
  .get(protectedRoute, restrictedRoute(["admin", "lecturer"]), getAllLecturer);

/**
 * @swagger
 * /api/v1/lecturer/deleteALecturer:
 *   patch:
 *     summary: Delete a Lecturer account
 *     tags: [Lecturers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: Lecturer ID
 *     responses:
 *       204:
 *         description: Lecturer deleted successfully
 *       404:
 *         description: Lecturer not found
 */
router
  .route("/deleteALecturer/:id")
  .patch(protectedRoute, restrictedRoute(["admin"]), deleteALecturer);

/**
 * @swagger
 * /api/v1/lecturer/updateALecturer:
 *   patch:
 *     summary: Update a Lecturer profile
 *     tags: [Lecturers]
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
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lecturer profile updated successfully
 *       400:
 *         description: Validation error
 */
router
  .route("/updateALecturer")
  .patch(protectedRoute, restrictedRoute(["admin"]), updateLecturer);

export default router;
