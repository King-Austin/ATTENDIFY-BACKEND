import express from "express";
import { protectedRoute, restrictedRoute } from "../controllers/authController";
import {
  createStudent,
  deleteAllTheStudent,
  deleteAStudent,
  fetchAllTheStudents,
  fetchStudentByLevel,
  fetchStudentByYearOfAdmission,
  updateStudentData,
} from "../controllers/studentController";

const router = express.Router();

/**
 * @swagger
 * /api/v1/student/createStudent:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
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
 *                 description: Name of the student
 *               level:
 *                 type: string
 *                 description: Level of the student
 *               yearOfAdmission:
 *                 type: string
 *                 description: Year of admission
 *     responses:
 *       201:
 *         description: Student created successfully
 *       403:
 *         description: Access forbidden
 */
router
  .route("/createStudent")
  .post(protectedRoute, restrictedRoute(["admin"]), createStudent);

/**
 * @swagger
 * /api/v1/student/fetchAllTheStudents:
 *   get:
 *     summary: Fetch all students
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: List of all students
 *       403:
 *         description: Access forbidden
 */
router.route("/fetchAllTheStudents").get(protectedRoute, fetchAllTheStudents);

/**
 * @swagger
 * /api/v1/student/fetchStudentByYearOfAdmission:
 *   get:
 *     summary: Fetch students by year of admission
 *     tags: [Students]
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: string
 *           description: Year of admission
 *     responses:
 *       200:
 *         description: List of students by year of admission
 *       403:
 *         description: Access forbidden
 */
router
  .route("/fetchStudentByYearOfAdmission")
  .get(fetchStudentByYearOfAdmission);

/**
 * @swagger
 * /api/v1/student/fetchStudentByLevel:
 *   get:
 *     summary: Fetch students by level
 *     tags: [Students]
 *     parameters:
 *       - in: query
 *         name: level
 *         required: true
 *         schema:
 *           type: string
 *           description: Level of the students to fetch
 *     responses:
 *       200:
 *         description: List of students by level
 *       403:
 *         description: Access forbidden
 */
router.route("/fetchStudentByLevel").get(protectedRoute, fetchStudentByLevel);

/**
 * @swagger
 * /api/v1/student/updateStudentData:
 *   patch:
 *     summary: Update student data
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: string
 *                 description: ID of the student to update
 *               updateData:
 *                 type: object
 *                 description: Data to update
 *     responses:
 *       200:
 *         description: Student data updated successfully
 *       403:
 *         description: Access forbidden
 */
router.route("/updateStudentData").patch(protectedRoute, updateStudentData);

/**
 * @swagger
 * /api/v1/student/deleteAStudent/{id}:
 *   delete:
 *     summary: Delete a student by ID
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID of the student to delete
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *       403:
 *         description: Access forbidden
 */
router
  .route("/deleteAStudent/:id")
  .delete(protectedRoute, restrictedRoute(["admin"]), deleteAStudent);

/**
 * @swagger
 * /api/v1/student/deleteAllTheStudent:
 *   delete:
 *     summary: Delete all students
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All students deleted successfully
 *       403:
 *         description: Access forbidden
 */
router
  .route("/deleteAllTheStudent")
  .delete(protectedRoute, restrictedRoute(["admin"]), deleteAllTheStudent);

/**
 * @swagger
 * /api/v1/student/fetchStudentByID/{id}:
 *   get:
 *     summary: Fetch student by ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID of the student
 *     responses:
 *       200:
 *         description: Student data retrieved successfully
 *       403:
 *         description: Access forbidden
 */
router
  .route("/fetchStudentByID/:id")
  .get(protectedRoute, fetchStudentByYearOfAdmission);

export default router;
