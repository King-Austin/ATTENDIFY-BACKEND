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
exports.deleteALecturer = exports.updateLecturer = exports.createALecturer = exports.getALecturer = exports.getAllLecturer = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = require("../errors/appError");
const dotenv_1 = require("dotenv");
const appResponse_1 = require("../utils/appResponse");
(0, dotenv_1.config)({ path: "./config.env" });
const { JWT_EXPIRES_IN, JWT_SECRET, JWT_COOKIE_EXPIRES, ORIGIN_URL } = process.env;
if (!JWT_EXPIRES_IN || !JWT_SECRET || !JWT_COOKIE_EXPIRES || !ORIGIN_URL) {
    throw new appError_1.AppError("Kindly make sure that these env variable are defined", 400);
}
//FOR FETCHING ALL THE USER
exports.getAllLecturer = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userModel_1.default.find();
    if (!users) {
        return next(new appError_1.AppError("Something went wrong. Please try again", 400));
    }
    return (0, appResponse_1.AppResponse)(res, 200, "success", "fetching lecturers succesful", users);
}));
//FOR FETCHING A USER USING ITS ID
exports.getALecturer = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const theUser = yield userModel_1.default.findById(id);
    if (!theUser) {
        return next(new appError_1.AppError("Something went wrong. Please try again", 400));
    }
    return (0, appResponse_1.AppResponse)(res, 200, "success", "fetching user succesful", theUser);
}));
//FOR CREATING A LECTURER, THIS WILL ONLY BE ACCESIBLE TO ADMIN
exports.createALecturer = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email } = req.body;
    //find user by email
    const userExistWithEmail = yield userModel_1.default.findOne({ email });
    const lecturerDetails = {
        fullName,
        email,
        password: `*12345${email}`,
        confirmPassword: `*12345${email}`
    };
    //if user already exist with the provided email, return an error message
    if (userExistWithEmail) {
        return next(new appError_1.AppError("user already exist with email", 400));
    }
    if (!fullName || !email) {
        return next(new appError_1.AppError("Kindly fill in the required field", 400));
    }
    const user = yield userModel_1.default.create(lecturerDetails);
    return (0, appResponse_1.AppResponse)(res, 201, "success", "Lecturer registration successful.", user);
}));
//FOR UPDATING USER INFO
exports.updateLecturer = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userUpdateInfo = req.body;
    if (Object.keys(userUpdateInfo).length === 0) {
        return next(new appError_1.AppError("No data provided for update", 400));
    }
    if (userUpdateInfo.password || userUpdateInfo.confirmPassword) {
        return next(new appError_1.AppError("This is not the route for updating password", 401));
    }
    const updatedUser = yield userModel_1.default.findByIdAndUpdate(id, userUpdateInfo, {
        new: true,
        runValidators: true,
    });
    if (!updatedUser) {
        return next(new appError_1.AppError("User does not exist", 404));
    }
    return (0, appResponse_1.AppResponse)(res, 200, "success", "User successfully updated", updatedUser);
}));
exports.deleteALecturer = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield userModel_1.default.findByIdAndUpdate(req.params.id, { active: false });
    return (0, appResponse_1.AppResponse)(res, 204, "success", "deleted successfully", null);
}));
