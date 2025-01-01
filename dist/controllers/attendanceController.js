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
exports.createAttendance = void 0;
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
