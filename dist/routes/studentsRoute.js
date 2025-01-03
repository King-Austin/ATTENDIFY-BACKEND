"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("src/controllers/authController");
const studentController_1 = require("src/controllers/studentController");
const router = express_1.default.Router();
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
    .post(authController_1.protectedRoute, (0, authController_1.restrictedRoute)(["admin"]), studentController_1.createStudent);
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
router.route("/fetchAllTheStudents").get(studentController_1.fetchAllTheStudents);
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
router.route("/fetchStudentByYearOfAdmission").get(studentController_1.fetchStudentByYearOfAdmission);
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
router.route("/fetchStudentByLevel").get(studentController_1.fetchStudentByLevel);
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
router.route("/updateStudentData").patch(studentController_1.updateStudentData);
/**
 * @swagger
 * /api/v1/student/deleteAStudent:
 *   post:
 *     summary: Delete a student
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
 *               studentId:
 *                 type: string
 *                 description: ID of the student to delete
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *       403:
 *         description: Access forbidden
 */
router.route("/deleteAStudent").post(studentController_1.deleteAStudent);
exports.default = router;
