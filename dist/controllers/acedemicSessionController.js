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
exports.deleteAllAcedemicSessions = exports.deleteAcedemicSession = exports.fetchAcedemicSessionByID = exports.fetchAllAcedemicSession = exports.createAcedemicSession = void 0;
const appError_1 = require("../errors/appError");
const acedemicSessionModel_1 = require("../models/acedemicSessionModel");
const appResponse_1 = require("../utils/appResponse");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const studentModel_1 = require("../models/studentModel");
const activitiesController_1 = require("./activitiesController");
const verifyTokenAndGetUser_1 = require("../utils/verifyTokenAndGetUser");
// CREATE A NEW SESSION
exports.createAcedemicSession = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, start, end } = req.body;
    // Fetch all students
    const students = yield studentModel_1.Students.find();
    if (!name || !start || !end) {
        return next(new appError_1.AppError("Please provide the required fields to create this session", 422));
    }
    const parsedStart = new Date(start);
    const parsedEnd = new Date(end);
    // Check if the session dates fall within any existing session
    const overlappingSession = yield acedemicSessionModel_1.AcedemicSession.findOne({
        $or: [
            { start: { $lte: parsedStart }, end: { $gte: parsedStart } },
            { start: { $lte: parsedEnd }, end: { $gte: parsedEnd } },
            { start: { $gte: parsedStart }, end: { $lte: parsedEnd } },
        ],
    });
    if (overlappingSession) {
        return next(new appError_1.AppError("There's another academic session within or overlapping with this date range.", 400));
    }
    // Create new session
    const newSession = yield acedemicSessionModel_1.AcedemicSession.create({
        name,
        start: parsedStart,
        end: parsedEnd,
    });
    if (!newSession) {
        return next(new appError_1.AppError("Could not create this session. Please try again.", 400));
    }
    // Set all existing active sessions to false
    yield acedemicSessionModel_1.AcedemicSession.updateMany({ active: false });
    // Set the new session as active
    newSession.active = true;
    yield newSession.save();
    // Promote students to the next level
    for (const student of students) {
        if (student.level === "100") {
            student.level = "200";
        }
        else if (student.level === "200") {
            student.level = "300";
        }
        else if (student.level === "300") {
            student.level = "400";
        }
        else if (student.level === "400") {
            student.level = "500";
        }
        else if (student.level === "500") {
            student.level = "graduated"; // Mark students as graduated
        }
        else if (student.level === "graduated") {
            student.level = "graduated";
        }
        yield student.save({ validateBeforeSave: false }); // Save the updated student level
    }
    const token = req.cookies.jwt;
    if (!token) {
        return next(new appError_1.AppError("You are not authorized to perform this action.", 401));
    }
    const user = yield (0, verifyTokenAndGetUser_1.verifyTokenAndGetUser)(token, next);
    const activityData = {
        userName: user === null || user === void 0 ? void 0 : user.fullName,
        userRole: user === null || user === void 0 ? void 0 : user.role,
        action: `${user === null || user === void 0 ? void 0 : user.fullName} created a new academic session. ${acedemicSessionModel_1.AcedemicSession.name}`,
    };
    if (user) {
        try {
            (0, activitiesController_1.createActivitiesController)(activityData);
        }
        catch (error) {
            return next(new appError_1.AppError("Failed to add activities", 400));
        }
    }
    return (0, appResponse_1.AppResponse)(res, 200, "success", "New session successfully created and students promoted", newSession);
}));
//FETCH ALL ACEDEMIC SESSION
exports.fetchAllAcedemicSession = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const allAcedemicSession = yield acedemicSessionModel_1.AcedemicSession.find();
    if (!allAcedemicSession) {
        return next(new appError_1.AppError("Could Not fetch all acedemic session.", 400));
    }
    return (0, appResponse_1.AppResponse)(res, 200, "success", "all acedemic session successfully fteched", allAcedemicSession);
}));
//FETCH A PARTICULAR ACEDEMIC SESSION USING ITS ID
exports.fetchAcedemicSessionByID = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const particularSession = yield acedemicSessionModel_1.AcedemicSession.findById(id);
    if (!particularSession) {
        return next(new appError_1.AppError("No acedemic session exist with this ID", 404));
    }
    return (0, appResponse_1.AppResponse)(res, 200, "success", "An Acedemic session successfully fetched.", particularSession);
}));
//DELETE A PARTICULAR ACEDEMIC SESSION USING ITS ID
exports.deleteAcedemicSession = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield acedemicSessionModel_1.AcedemicSession.findByIdAndDelete(id);
    const findAcad = yield acedemicSessionModel_1.AcedemicSession.findById(id);
    const token = req.cookies.jwt;
    if (!token) {
        return next(new appError_1.AppError("You are not authorized to perform this action.", 401));
    }
    const user = yield (0, verifyTokenAndGetUser_1.verifyTokenAndGetUser)(token, next);
    const activityData = {
        userName: user === null || user === void 0 ? void 0 : user.fullName,
        userRole: user === null || user === void 0 ? void 0 : user.role,
        action: `${user === null || user === void 0 ? void 0 : user.fullName} just deleted ${findAcad === null || findAcad === void 0 ? void 0 : findAcad.name} session.`,
    };
    if (user) {
        try {
            (0, activitiesController_1.createActivitiesController)(activityData);
        }
        catch (error) {
            return next(new appError_1.AppError("Failed to add activities", 400));
        }
    }
    return (0, appResponse_1.AppResponse)(res, 200, "success", "An Acedemic session successfully deleted.", null);
}));
//DELETE ALL ACEDEMIC SESSION
exports.deleteAllAcedemicSessions = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield acedemicSessionModel_1.AcedemicSession.deleteMany();
    return (0, appResponse_1.AppResponse)(res, 200, "success", "An Acedemic session successfully deleted.", null);
}));
