"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const lecturerController_1 = require("../controllers/lecturerController");
const router = express_1.default.Router();
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
    .post(authController_1.protectedRoute, (0, authController_1.restrictedRoute)(["admin"]), lecturerController_1.createALecturer);
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
    .get(authController_1.protectedRoute, (0, authController_1.restrictedRoute)(["admin"]), lecturerController_1.getALecturer);
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
    .get(authController_1.protectedRoute, /*restrictedRoute(["admin"]),*/ lecturerController_1.getAllLecturer);
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
    .patch(authController_1.protectedRoute, (0, authController_1.restrictedRoute)(["admin"]), lecturerController_1.deleteALecturer);
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
    .patch(authController_1.protectedRoute, (0, authController_1.restrictedRoute)(["admin"]), lecturerController_1.updateLecturer);
exports.default = router;
