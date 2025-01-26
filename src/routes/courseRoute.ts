import express from "express";
import {
  protectedRoute,
  restrictedRoute,
} from "src/controllers/authController";
import {
  addNewCourse,
  deleteACourse,
  fetchAllCourse,
  fetchCourseByLevel,
  fetchCourseBySemester,
} from "src/controllers/courseController";

const router = express.Router();
  
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
  .post(protectedRoute, restrictedRoute(["admin"]), addNewCourse);

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
router.route("/fetchAllCourse").get(fetchAllCourse);

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
router.route("/fetchCoursesByLevel/:level").get(fetchCourseByLevel);

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
router.route("/fetchCoursesBySemester/:semester").get(fetchCourseBySemester);

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
  .delete(protectedRoute, restrictedRoute(["admin"]), deleteACourse);

export default router;
