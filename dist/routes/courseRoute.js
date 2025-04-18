"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const courseController_1 = require("../controllers/courseController");
const router = express_1.default.Router();
/**
 * @swagger
 * /api/v1/course/addANewCourse:
 *   post:
 *     summary: Add a new course
 *     tags: [Courses]
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
 *                 description: Name of the course
 *               code:
 *                 type: string
 *                 description: Code of the course
 *               level:
 *                 type: string
 *                 description: Level of the course
 *               semester:
 *                 type: string
 *                 description: Semester of the course
 *     responses:
 *       201:
 *         description: Course added successfully
 *       403:
 *         description: Access forbidden
 */
router
    .route("/addANewCourse")
    .post(authController_1.protectedRoute, (0, authController_1.restrictedRoute)(["admin"]), courseController_1.addNewCourse);
/**
 * @swagger
 * /api/v1/course/fetchAllCourse:
 *   get:
 *     summary: Fetch all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of all courses
 *       403:
 *         description: Access forbidden
 */
router.route("/fetchAllCourse").get(authController_1.protectedRoute, courseController_1.fetchAllCourse);
/**
 * @swagger
 * /api/v1/course/fetchCoursesByLevel/{level}:
 *   get:
 *     summary: Fetch courses by level
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: level
 *         required: true
 *         schema:
 *           type: string
 *           description: Level of the courses to fetch
 *     responses:
 *       200:
 *         description: List of courses by level
 *       403:
 *         description: Access forbidden
 */
router.route("/fetchCoursesByLevel/:level").get(authController_1.protectedRoute, courseController_1.fetchCourseByLevel);
/**
 * @swagger
 * /api/v1/course/fetchCoursesBySemester/{semester}:
 *   get:
 *     summary: Fetch courses by semester
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: semester
 *         required: true
 *         schema:
 *           type: string
 *           description: Semester of the courses to fetch
 *     responses:
 *       200:
 *         description: List of courses by semester
 *       403:
 *         description: Access forbidden
 */
router.route("/fetchCoursesBySemester/:semester").get(authController_1.protectedRoute, courseController_1.fetchCourseBySemester);
/**
 * @swagger
 * /api/v1/course/deleteACourse/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID of the course to delete
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       403:
 *         description: Access forbidden
 */
router
    .route("/deleteACourse/:id")
    .delete(authController_1.protectedRoute, (0, authController_1.restrictedRoute)(["admin"]), courseController_1.deleteACourse);
/**
 * @swagger
 * /api/v1/course/deleteAllCourses:
 *   delete:
 *     summary: Delete all courses
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All courses deleted successfully
 *       403:
 *         description: Access forbidden
 */
router.route("/deleteAllCourses").delete(authController_1.protectedRoute, (0, authController_1.restrictedRoute)(["admin"]), courseController_1.deleteAllCourses);
exports.default = router;
