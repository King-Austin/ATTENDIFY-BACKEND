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
exports.deleteAllTheAttendance = exports.addStudentToTheAttendance = exports.fetchAttendanceBySession = exports.deleteAttendanceByID = exports.fetchAllAttendance = exports.deactivateAttendance = exports.markAbsent = exports.markAttendance = exports.activateAttendance = exports.createAttendance = void 0;
const appError_1 = require("../errors/appError");
const acedemicSessionModel_1 = require("../models/acedemicSessionModel");
const attendanceModel_1 = require("../models/attendanceModel");
const courseModel_1 = require("../models/courseModel");
const studentModel_1 = require("../models/studentModel");
const appResponse_1 = require("../utils/appResponse");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
//CREATE ATTENDANCE
exports.createAttendance = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { course, acedemicSession, semester, level } = req.body;
    if (!course || !acedemicSession || !semester || !level) {
        return next(new appError_1.AppError("please fill in the required field", 422));
    }
    //const semesterlowercase = semester.toLowerCase()
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
        semester, //: semesterlowercase,
        level,
        students,
    });
    // Step 4: Send a success response
    return (0, appResponse_1.AppResponse)(res, 200, "success", `Attendance for ${theCourse.courseCode} successfully created.`, newAttendance);
}));
// Activate attendance and mark all students as absent for the day
exports.activateAttendance = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { attendanceId } = req.params;
    // Find the attendance record for the specific course
    const attendanceRecord = yield attendanceModel_1.Attendance.findById(attendanceId)
        .populate("course")
        .populate("acedemicSession");
    if (!attendanceRecord) {
        return next(new appError_1.AppError("Attendance record not found for the course.", 404));
    }
    if (attendanceRecord.active) {
        return next(new appError_1.AppError("Attendance is already active for this course.", 400));
    }
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    // Mark all students as absent for today, but only if they don't already have an attendance record for today
    attendanceRecord.students.forEach((student) => {
        const alreadyMarked = student.attendanceStatus.some((record) => record.date.toISOString().split("T")[0] === today);
        if (!alreadyMarked) {
            student.attendanceStatus.push({
                date: new Date(),
                status: "absent",
            });
        }
    });
    // Activate the attendance
    attendanceRecord.active = true;
    yield attendanceRecord.save();
    return (0, appResponse_1.AppResponse)(res, 200, "success", `Attendance activated for students to mark`, attendanceRecord);
}));
//MARK ATTENDANCE
exports.markAttendance = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { attendanceId } = req.params;
    const { regNo, level } = req.body; // Include level in the request body
    // Find the attendance record
    const attendance = yield attendanceModel_1.Attendance.findById(attendanceId);
    if (!attendance) {
        return next(new appError_1.AppError("Attendance not found.", 404));
    }
    // Check if the attendance is active
    if (!attendance.active) {
        return next(new appError_1.AppError("Attendance is not active.", 400));
    }
    // // Check if the level in the request matches the level in the attendance record
    if (attendance.level !== level) {
        return next(new appError_1.AppError("Attendance cannot be marked for this level.", 400));
    }
    // Find the student by matching the fingerprint
    const student = attendance.students.find((student) => /*student.fingerPrint === fingerprint || */ student.regNo === regNo);
    if (!student) {
        return next(new appError_1.AppError("Student not found with the reg no or fingerprint mismatch.", 404));
    }
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];
    // Check if the student is marked absent for today
    const attendanceRecordIndex = student.attendanceStatus.findIndex((record) => record.date.toISOString().split("T")[0] === today &&
        record.status === "absent");
    if (attendanceRecordIndex === -1) {
        return next(new appError_1.AppError("No absent record found for today to update.", 400));
    }
    // Update the status to "present"
    student.attendanceStatus[attendanceRecordIndex].status = "present";
    // Save the updated attendance record
    yield attendance.save();
    return (0, appResponse_1.AppResponse)(res, 200, "success", `Attendance successfully taken.`, student);
}));
//MARK ABSENT
exports.markAbsent = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { attendanceId } = req.params;
    const { fingerprint, regNo } = req.body;
    // Find the attendance record
    const attendance = yield attendanceModel_1.Attendance.findById(attendanceId);
    if (!attendance) {
        return next(new appError_1.AppError("Attendance not found.", 404));
    }
    // Check if the attendance is active
    if (!attendance.active) {
        return next(new appError_1.AppError("Attendance is not active.", 400));
    }
    // Find the student by matching the fingerprint
    const student = attendance.students.find((student) => student.fingerPrint === fingerprint || student.regNo === regNo);
    if (!student) {
        return next(new appError_1.AppError("Student not found with the reg no or fingerprint mismatch.", 404));
    }
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];
    // Check if the student is already marked as absent for today
    const attendanceRecordIndex = student.attendanceStatus.findIndex((record) => record.date.toISOString().split("T")[0] === today &&
        record.status === "absent");
    if (attendanceRecordIndex !== -1) {
        return next(new appError_1.AppError("Student is already marked as absent for today.", 400));
    }
    // Add a new record to mark the student as "absent"
    student.attendanceStatus.push({
        date: new Date(),
        status: "absent",
    });
    // Save the updated attendance record
    yield attendance.save();
    return (0, appResponse_1.AppResponse)(res, 200, "success", `Attendance successfully marked as absent.`, student);
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
//FETCH ALL ATTENDANCE RECORDS
exports.fetchAllAttendance = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch all attendance records 
    const attendanceRecords = yield attendanceModel_1.Attendance.find()
        .populate("course")
        .populate("acedemicSession");
    if (!attendanceRecords) {
        return next(new appError_1.AppError("Could not find attendance records", 404));
    }
    return (0, appResponse_1.AppResponse)(res, 200, "success", `Attendance fetched successfully.`, attendanceRecords);
}));
//DELETE ATTENDANCE BY ID
exports.deleteAttendanceByID = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { attendanceId } = req.params;
    const attendance = yield attendanceModel_1.Attendance.findById(attendanceId);
    if (!attendance) {
        return next(new appError_1.AppError("Attendance not found.", 404));
    }
    yield attendanceModel_1.Attendance.findByIdAndDelete(attendanceId);
    return (0, appResponse_1.AppResponse)(res, 200, "success", `Attendance deleted successfully.`, null);
}));
//FETCH ATTENDANCE BY SESSION
exports.fetchAttendanceBySession = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { sessionId } = req.params; // Academic session ID passed as parameter
    // Find the academic session by ID
    const academicSession = yield acedemicSessionModel_1.AcedemicSession.findById(sessionId);
    if (!academicSession) {
        return next(new appError_1.AppError("Academic session not found.", 404));
    }
    // Fetch all attendance records for the specified academic session
    const attendanceRecords = yield attendanceModel_1.Attendance.find({
        acedemicSession: sessionId,
    }).populate("course"); // populate the course details
    if (!attendanceRecords || attendanceRecords.length === 0) {
        return next(new appError_1.AppError("No attendance records found for this academic session.", 404));
    }
    return (0, appResponse_1.AppResponse)(res, 200, "success", `Attendance fetched successfully.`, attendanceRecords);
}));
//ADD STUDENT TO ATTENDANCE
exports.addStudentToTheAttendance = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { attendanceId } = req.params; // Attendance ID
    const { studentId } = req.body;
    // Find the attendance record
    const theAttendance = yield attendanceModel_1.Attendance.findById(attendanceId);
    const theStudent = yield studentModel_1.Students.findById(studentId);
    if (!theAttendance) {
        return next(new appError_1.AppError("This attendance does not exist.", 404));
    }
    if (!theStudent) {
        return next(new appError_1.AppError("This student does not exist. Kindly add the student.", 404));
    }
    // Check if the student is already in the attendance list
    const studentExists = theAttendance.students.some((student) => student.studentId.toString() === studentId);
    if (studentExists) {
        return next(new appError_1.AppError("Student is already added to this attendance.", 400));
    }
    // Create the student object
    const newStudent = {
        studentId: theStudent.id,
        name: theStudent.name,
        regNo: theStudent.regNo,
        level: theStudent.level,
        fingerPrint: theStudent.fingerPrint,
        addmissionYear: theStudent.addmissionYear,
        attendanceStatus: [], // Initially empty
    };
    // Add the new student to the attendance list
    theAttendance.students.push(newStudent);
    // Save the updated attendance record
    yield theAttendance.save();
    return (0, appResponse_1.AppResponse)(res, 200, "success", "Student successfully added to attendance.", theAttendance);
}));
//DELETE ALL ATTENDANCE
exports.deleteAllTheAttendance = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield attendanceModel_1.Attendance.deleteMany();
    return (0, appResponse_1.AppResponse)(res, 200, "success", "All attendance successfully deleted.", null);
}));
// export const getAttendanceWithPagination = catchAsync(async (req, res, next) => {
//   const { sessionId } = req.params; // Academic session ID passed as parameter
//   const { page = 1, limit = 10 } = req.query; // Pagination parameters with default values
//   // Validate academic session existence
//   const academicSession = await AcedemicSession.findById(sessionId);
//   if (!academicSession) {
//     return next(new AppError("Academic session not found.", 404));
//   }
//   // Pagination calculation
//   const skip = (page - 1) * limit;
//   // Fetch attendance records with pagination
//   const attendanceRecords = await Attendance.find({ acedemicSession: sessionId })
//     .skip(skip)
//     .limit(Number(limit))
//     .populate('course') // Optional: populate the course details
//     .populate('students.studentId'); // Optional: populate student details
//   // Count total records for pagination metadata
//   const totalRecords = await Attendance.countDocuments({ acedemicSession: sessionId });
//   // Handle case when no records are found
//   if (!attendanceRecords || attendanceRecords.length === 0) {
//     return next(new AppError("No attendance records found for this academic session.", 404));
//   }
//   res.status(200).json({
//     status: "success",
//     data: attendanceRecords,
//     pagination: {
//       totalRecords,
//       totalPages: Math.ceil(totalRecords / limit),
//       currentPage: Number(page),
//       pageSize: Number(limit),
//     },
//   });
// });
