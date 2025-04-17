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
exports.deleteAllCourses = exports.deleteACourse = exports.fetchCourseBySemester = exports.fetchCourseByLevel = exports.fetchAllCourse = exports.addNewCourse = void 0;
const appError_1 = require("../errors/appError");
const courseModel_1 = require("../models/courseModel");
const appResponse_1 = require("../utils/appResponse");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const activitiesController_1 = require("./activitiesController");
const verifyTokenAndGetUser_1 = require("src/utils/verifyTokenAndGetUser");
//ADD NEW COURSE
exports.addNewCourse = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseTitle, courseCode, semester, level } = req.body;
    if (!courseTitle || !courseCode || !semester || !level) {
        return next(new appError_1.AppError("Kindly fill in the required field", 422));
    }
    const newCourse = yield courseModel_1.Course.create({
        courseTitle,
        courseCode,
        level,
        semester,
    });
    if (!newCourse) {
        return next(new appError_1.AppError("Could not add this course. Please try agaim", 400));
    }
    const token = req.cookies.jwt;
    if (!token) {
        return next(new appError_1.AppError("You are not authorized to perform this action.", 401));
    }
    const user = yield (0, verifyTokenAndGetUser_1.verifyTokenAndGetUser)(token, next);
    // if (!user) {
    //   return next(
    //     new AppError(
    //       "Could not find user with this token. please login again.",
    //       404
    //     )
    //   );
    // }
    const activityData = {
        userName: user === null || user === void 0 ? void 0 : user.fullName,
        userRole: user === null || user === void 0 ? void 0 : user.role,
        action: `${user === null || user === void 0 ? void 0 : user.fullName} added a new ${newCourse.level} course. ${newCourse.courseCode}`
    };
    if (user) {
        try {
            (0, activitiesController_1.createActivitiesController)(activityData);
        }
        catch (error) {
            return next(new appError_1.AppError("Failed to add activities", 400));
        }
    }
    return (0, appResponse_1.AppResponse)(res, 200, "success", "New course successfully added", newCourse);
}));
//FETCH COURSES OFFERED ACCROSS ALL LEVEL
exports.fetchAllCourse = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const allCourse = yield courseModel_1.Course.find();
    if (!allCourse) {
        return next(new appError_1.AppError("Could not fetch all the course", 400));
    }
    return (0, appResponse_1.AppResponse)(res, 200, "success", "Course successfully fetched", allCourse);
}));
//FETCH COURSES OFFERED IN A PARTICULAR LEVEL
exports.fetchCourseByLevel = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { level } = req.params;
    const course = yield courseModel_1.Course.find({ level });
    if (!course) {
        return next(new appError_1.AppError(`Could not fetch ${level} level courses. Please try again`, 400));
    }
    return (0, appResponse_1.AppResponse)(res, 200, "success", `${level} level courses successfully fetched.`, course);
}));
//FETCH COURSES OFFERED IN A PARTICULAR SEMESTER . E.G first semsters courses
exports.fetchCourseBySemester = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { semester } = req.params;
    const course = yield courseModel_1.Course.find({ semester });
    if (!course) {
        return next(new appError_1.AppError(`Could not fetch ${semester}  courses. Please try again`, 400));
    }
    return (0, appResponse_1.AppResponse)(res, 200, "success", `${semester}  courses successfully fetched.`, course);
}));
//DELETE A PARTICULAR COURSE USING ITS ID
exports.deleteACourse = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield courseModel_1.Course.findByIdAndDelete(id);
    const findCourse = yield courseModel_1.Course.findById(id);
    const token = req.cookies.jwt;
    if (!token) {
        return next(new appError_1.AppError("You are not authorized to perform this action.", 401));
    }
    const user = yield (0, verifyTokenAndGetUser_1.verifyTokenAndGetUser)(token, next);
    // if (!user) {
    //   return next(
    //     new AppError(
    //       "Could not find user with this token. please login again.",
    //       404
    //     )
    //   );
    // }
    const activityData = {
        userName: user === null || user === void 0 ? void 0 : user.fullName,
        userRole: user === null || user === void 0 ? void 0 : user.role,
        action: `${user === null || user === void 0 ? void 0 : user.fullName} deleted a ${findCourse === null || findCourse === void 0 ? void 0 : findCourse.level} course. ${findCourse === null || findCourse === void 0 ? void 0 : findCourse.courseCode}`
    };
    if (user) {
        try {
            (0, activitiesController_1.createActivitiesController)(activityData);
        }
        catch (error) {
            return next(new appError_1.AppError("Failed to add activities", 400));
        }
    }
    return (0, appResponse_1.AppResponse)(res, 200, "success", "A course successfully deleted", null);
}));
//DELETE A PARTICULAR COURSE USING ITS ID
exports.deleteAllCourses = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield courseModel_1.Course.deleteMany();
    return (0, appResponse_1.AppResponse)(res, 200, "success", "A course successfully deleted", null);
}));
