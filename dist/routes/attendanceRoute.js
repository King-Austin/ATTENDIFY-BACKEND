"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const attendanceController_1 = require("../controllers/attendanceController");
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
/**
 * @swagger
 * /api/v1/attendance/createAttendance:
 *   post:
 *     summary: Create a new attendance record
 *     tags: [Attendance]
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
 *                 description: ID of the academic session
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date for the attendance record
 *     responses:
 *       201:
 *         description: Attendance record created successfully
 *       403:
 *         description: Access forbidden
 */
router.post("/createAttendance", authController_1.protectedRoute, attendanceController_1.createAttendance);
/**
 * @swagger
 * /api/v1/attendance/activateAttendance/{attendanceId}:
 *   patch:
 *     summary: Activate an attendance record
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attendanceId
 *         required: true
 *         schema:
 *           type: string
 *           description: ID of the attendance record to activate
 *     responses:
 *       200:
 *         description: Attendance record activated successfully
 *       403:
 *         description: Access forbidden
 */
router.patch("/activateAttendance/:attendanceId", authController_1.protectedRoute, attendanceController_1.activateAttendance);
/**
 * @swagger
 * /api/v1/attendance/markAttendance/{attendanceId}:
 *   patch:
 *     summary: Mark attendance for a specific record
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attendanceId
 *         required: true
 *         schema:
 *           type: string
 *           description: ID of the attendance record to mark
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: string
 *                 description: ID of the student
 *     responses:
 *       200:
 *         description: Attendance marked successfully
 *       403:
 *         description: Access forbidden
 */
router.patch("/markAttendance/:attendanceId", authController_1.protectedRoute, (0, authController_1.restrictedRoute)(["admin", "lecturer"]), attendanceController_1.markAttendance);
/**
 * @swagger
 * /api/v1/attendance/deactivateAttendance/{attendanceId}:
 *   patch:
 *     summary: Deactivate an attendance record
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attendanceId
 *         required: true
 *         schema:
 *           type: string
 *           description: ID of the attendance record to deactivate
 *     responses:
 *       200:
 *         description: Attendance record deactivated successfully
 *       403:
 *         description: Access forbidden
 */
router.patch("/deactivateAttendance/:attendanceId", authController_1.protectedRoute, (0, authController_1.restrictedRoute)(["admin"]), attendanceController_1.deactivateAttendance);
/**
 * @swagger
 * /api/v1/attendance/fetchAllAttendance:
 *   get:
 *     summary: Fetch all attendance records
 *     tags: [Attendance]
 *     responses:
 *       200:
 *         description: List of all attendance records
 *       403:
 *         description: Access forbidden
 */
router.get("/fetchAllAttendance", attendanceController_1.fetchAllAttendance);
/**
 * @swagger
 * /api/v1/attendance/fetchAttendanceBySession/{sessionId}:
 *   get:
 *     summary: Fetch attendance records by session ID
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *           description: ID of the academic session
 *     responses:
 *       200:
 *         description: List of attendance records for the session
 *       403:
 *         description: Access forbidden
 */
router.get("/fetchAttendanceBySession/:sessionId", attendanceController_1.fetchAttendanceBySession);
/**
 * @swagger
 * /api/v1/attendance/deleteAttendance/{attendanceId}:
 *   delete:
 *     summary: Delete an attendance record by ID
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: attendanceId
 *         required: true
 *         schema:
 *           type: string
 *           description: ID of the attendance record to delete
 *     responses:
 *       200:
 *         description: Attendance record deleted successfully
 *       403:
 *         description: Access forbidden
 */
router.delete("/deleteAttendance/:attendanceId", authController_1.protectedRoute, (0, authController_1.restrictedRoute)(["admin"]), attendanceController_1.deleteAttendanceByID);
/**
 * @swagger
 * /api/v1/attendance/deleteAllAttendance:
 *   delete:
 *     summary: Delete all attendance records
 *     tags: [Attendance]
 *     responses:
 *       200:
 *         description: All attendance records deleted successfully
 *       403:
 *         description: Access forbidden
 */
router.delete("/deleteAllAttendance", authController_1.protectedRoute, (0, authController_1.restrictedRoute)(["admin"]), attendanceController_1.deleteAllTheAttendance);
/**
 * @swagger
 * /api/v1/attendance/markAbsent/{attendanceId}:
 *   patch:
 *     summary: Mark a student as absent
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: attendanceId
 *         required: true
 *         schema:
 *           type: string
 *           description: ID of the attendance record
 *     responses:
 *       200:
 *         description: Student marked as absent
 *       403:
 *         description: Access forbidden
 */
router.patch("/markAbsent/:attendanceId", attendanceController_1.markAbsent);
router.patch("/addCarryoverStudentToTheAttendance/:attendanceId", authController_1.protectedRoute, (0, authController_1.restrictedRoute)(["admin", "lecturer"]), attendanceController_1.addCarryoverStudentToTheAttendance);
exports.default = router;
