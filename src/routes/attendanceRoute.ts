import express from "express";
import { deleteAllAcedemicSessions } from "src/controllers/acedemicSessionController";
import {
  activateAttendance,
  createAttendance,
  deactivateAttendance,
  deleteAttendanceByID,
  fetchAllAttendance,
  fetchAttendanceBySession,
  markAttendance,
} from "src/controllers/attendanceController";

const router = express.Router();

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
router.post("/createAttendance", createAttendance);

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
router.patch("/activateAttendance/:attendanceId", activateAttendance);

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
router.patch("/markAttendance/:attendanceId", markAttendance);

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
router.patch("/deactivateAttendance/:attendanceId", deactivateAttendance);

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
router.get("/fetchAllAttendance", fetchAllAttendance);

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
router.get("/fetchAttendanceBySession/:sessionId", fetchAttendanceBySession);

router.delete("/deleteAttendance/:attendanceId", deleteAttendanceByID);

router.delete("/deleteAllTheAttendance", deleteAllAcedemicSessions);

router.patch("/addStudentToTheAttendance/:attendanceId", deleteAttendanceByID);

export default router;
