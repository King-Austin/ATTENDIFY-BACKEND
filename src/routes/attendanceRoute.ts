import express from "express";
import {
  activateAttendance,
  createAttendance,
  deactivateAttendance,
  fetchAllAttendance,
  fetchAttendanceBySession,
  markAttendance,
} from "src/controllers/attendanceController";

const router = express.Router();

router.post("/createAttendance", createAttendance);

router.patch("/activateAttendance/:attendanceId", activateAttendance);

router.patch("/markAttendance/:attendanceId", markAttendance);

router.patch("/deactivateAttendance/:attendanceId", deactivateAttendance);

router.get("/fetchAllAttendance", fetchAllAttendance);

router.get("/fetchAttendanceBySession/:sessionId", fetchAttendanceBySession);

export default router;
