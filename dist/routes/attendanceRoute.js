"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const attendanceController_1 = require("src/controllers/attendanceController");
const router = express_1.default.Router();
router.post("/createAttendance", attendanceController_1.createAttendance);
router.patch("/activateAttendance/:attendanceId", attendanceController_1.activateAttendance);
router.patch("/markAttendance/:attendanceId", attendanceController_1.markAttendance);
router.patch("/deactivateAttendance/:attendanceId", attendanceController_1.deactivateAttendance);
router.get("/fetchAllAttendance", attendanceController_1.fetchAllAttendance);
router.get("/fetchAttendanceBySession/:sessionId", attendanceController_1.fetchAttendanceBySession);
exports.default = router;
