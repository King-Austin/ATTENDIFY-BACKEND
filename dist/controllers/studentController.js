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
exports.deleteAStudent = exports.updateStudentData = exports.fetchStudentByLevel = exports.fetchStudentByYearOfAdmission = exports.fetchAllTheStudents = exports.createStudent = void 0;
const appError_1 = require("src/errors/appError");
const studentModel_1 = require("src/models/studentModel");
const appResponse_1 = require("src/utils/appResponse");
const catchAsync_1 = __importDefault(require("src/utils/catchAsync"));
//CREATE A NEW STUDENT
exports.createStudent = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, regNo, level, course, fingerPrint, addmissionYear } = req.body;
    if (!name || !regNo || !level || !course || !fingerPrint || !addmissionYear) {
        return next(new appError_1.AppError("Please fill in the required field", 422));
    }
    const newStudent = yield studentModel_1.Students.create({
        name,
        regNo,
        level,
        course,
        fingerPrint,
        addmissionYear,
    });
    if (!newStudent) {
        return next(new appError_1.AppError("Could not create student. Please try again", 400));
    }
    return (0, appResponse_1.AppResponse)(res, 201, "success", "Student successfully created", newStudent);
}));
//FETCH ALL THE STUDENT
exports.fetchAllTheStudents = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const allTheStudent = yield studentModel_1.Students.find();
    if (!allTheStudent) {
        return next(new appError_1.AppError("Could not fetch all the student. Please try again", 400));
    }
    return (0, appResponse_1.AppResponse)(res, 200, "success", "students successfully fetched.", allTheStudent);
}));
//FETCH STUDENTS BY YEAR OF ADMISSION
exports.fetchStudentByYearOfAdmission = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { addmissionYear } = req.params;
    if (!addmissionYear) {
        return next(new appError_1.AppError("Kindly provide the year of admission", 400));
    }
    const students = yield studentModel_1.Students.find({ addmissionYear });
    if (!students) {
        return next(new appError_1.AppError(`Could not fetch students given addmission on ${addmissionYear}. Please try again`, 400));
    }
    return (0, appResponse_1.AppResponse)(res, 200, "success", `Students admitted on ${addmissionYear} successfully fetch`, students);
}));
//FETCH STUDENTS BY LEVEL
exports.fetchStudentByLevel = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { level } = req.params;
    if (!level) {
        return next(new appError_1.AppError("Kindly provide the year of admission", 400));
    }
    const students = yield studentModel_1.Students.find({ level });
    if (!students) {
        return next(new appError_1.AppError(`Could not fetch students in ${level} level. Please try again`, 400));
    }
    return (0, appResponse_1.AppResponse)(res, 200, "success", `Students in ${level} level successfully fetched.`, students);
}));
//UPDATE A STUDENT DATA
exports.updateStudentData = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, regNo, level, course, fingerPrint, addmissionYear } = req.body;
    if (!name || !regNo || !level || !course || !fingerPrint || !addmissionYear) {
        return next(new appError_1.AppError("Please fill in the required field", 422));
    }
    const student = yield studentModel_1.Students.findByIdAndUpdate(id, {
        name,
        regNo,
        level,
        course,
        fingerPrint,
        addmissionYear,
    }, { runValidators: false, new: true });
    return (0, appResponse_1.AppResponse)(res, 200, "success", "Student data successfully updated", student);
}));
//DELETE A PARTICULAR STUDENT USING ITS ID
exports.deleteAStudent = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield studentModel_1.Students.findByIdAndDelete(id);
    return (0, appResponse_1.AppResponse)(res, 200, "success", "Student data successfully deleted", null);
}));
