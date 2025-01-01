"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateAttendance = exports.markAttendance = exports.activateAttendance = exports.createAttendance = void 0;
const appError_1 = require("src/errors/appError");
const acedemicSessionModel_1 = require("src/models/acedemicSessionModel");
const attendanceModel_1 = require("src/models/attendanceModel");
const courseModel_1 = require("src/models/courseModel");
const studentModel_1 = require("src/models/studentModel");
const appResponse_1 = require("src/utils/appResponse");
const catchAsync_1 = __importDefault(require("src/utils/catchAsync"));
exports.createAttendance = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { course, acedemicSession, semester, level } = req.body;
    // Step 1: Validate inputs and fetch related data
    const studentsOfferingTheCourse = yield studentModel_1.Students.find({ level });
    if (!studentsOfferingTheCourse || studentsOfferingTheCourse.length === 0) {
        return next(new appError_1.AppError("Could not find students offering this course.", 404));
    }
    const theCourseAcedemicSession = yield acedemicSessionModel_1.AcedemicSession.findById(acedemicSession);
    if (!theCourseAcedemicSession) {
        return next(new appError_1.AppError("The academic session that you selected does not exist in the database any longer.", 404));
    }
    const theCourse = yield courseModel_1.Course.findById(course);
    if (!theCourse) {
        return next(new appError_1.AppError("This course does not exist.", 404));
    }
    // Step 2: Prepare the `students` array for the attendance record
    const students = studentsOfferingTheCourse.map((student) => ({
        studentId: student._id,
        name: student.name,
        regNo: student.regNo,
        level: student.level,
        fingerPrint: student.fingerPrint,
        addmissionYear: student.addmissionYear,
        attendanceStatus: [], // Initially empty; will be updated when attendance is activated
    }));
    // Step 3: Create the attendance record
    const newAttendance = yield attendanceModel_1.Attendance.create({
        course,
        acedemicSession,
        semester,
        level,
        students,
    });
    // Step 4: Send a success response
    return (0, appResponse_1.AppResponse)(res, 200, "success", `Attendance for ${theCourse.courseCode} successfully created.`, newAttendance);
}));
// Activate attendance and mark all students as absent for the day
exports.activateAttendance = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { attendanceId } = req.params;
    const { courseId, sessionId } = req.body;
    // Find the attendance record for the specific course
    const attendanceRecord = yield attendanceModel_1.Attendance.findOne({
        course: courseId,
        acedemicSession: sessionId,
    })
        .populate("course")
        .populate("acedemicSession");
    if (!attendanceRecord) {
        return next(new appError_1.AppError("Attendance record not found for the course.", 404));
    }
    if (attendanceRecord.active) {
        return next(new appError_1.AppError("Attendance is already active for this course.", 400));
    }
    const today = new Date();
    // Mark all students as absent for today
    attendanceRecord.students.forEach((student) => {
        student.attendanceStatus.push({
            date: today,
            status: "absent",
        });
    });
    // Activate the attendance
    attendanceRecord.active = true;
    yield attendanceRecord.save();
    return (0, appResponse_1.AppResponse)(res, 200, "success", `Attendance activated for students to mark`, attendanceRecord);
}));
//MARK ATTENDANCE
exports.markAttendance = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { attendanceId } = req.params;
    const { fingerprint, level, regNo } = req.body; // Include level in the request body
    // Find the attendance record
    const attendance = yield attendanceModel_1.Attendance.findById(attendanceId);
    if (!attendance) {
        return next(new appError_1.AppError("Attendance not found.", 404));
    }
    // Check if the attendance is active
    if (!attendance.active) {
        return next(new appError_1.AppError("Attendance is not active.", 400));
    }
    // Check if the level in the request matches the level in the attendance record
    if (attendance.level !== level) {
        return next(new appError_1.AppError("Attendance cannot be marked for this level.", 400));
    }
    // Find the student by matching the fingerprint
    const student = attendance.students.find((student) => student.fingerPrint === fingerprint || student.regNo === regNo);
    if (!student) {
        return next(new appError_1.AppError("Student not found with the reg no or fingerprint mismatch.", 404));
    }
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    // Check if attendance is already marked for today
    const alreadyMarked = student.attendanceStatus.some((record) => record.date.toISOString().split("T")[0] === today);
    if (alreadyMarked) {
        return next(new appError_1.AppError("Attendance already marked for today.", 400));
    }
    // Mark the student as present for today
    student.attendanceStatus.push({
        date: new Date(),
        status: "present",
    });
    // Save the updated attendance record
    yield attendance.save();
    return (0, appResponse_1.AppResponse)(res, 200, "success", `Attendance successfully taken.`, student);
}));
//DEACTIVATE ATTENDANCE
exports.deactivateAttendance = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { attendanceId } = req.params;
    const attendance = yield attendanceModel_1.Attendance.findById(attendanceId);
    if (!attendance) {
        return next(new appError_1.AppError("Attendance not found.", 404));
    }
    if (!attendance.active) {
        return next(new appError_1.AppError("Attendance is already inactive.", 400));
    }
    attendance.active = false;
    yield attendance.save();
    return (0, appResponse_1.AppResponse)(res, 200, "success", `Attendance deactivated successfully.`, attendance);
}));
