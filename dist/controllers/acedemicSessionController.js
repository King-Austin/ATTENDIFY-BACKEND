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
exports.deleteAcedemicSession = exports.fetchAllAcedemicSession = exports.createAcedemicSession = void 0;
const appError_1 = require("src/errors/appError");
const acedemicSessionModel_1 = require("src/models/acedemicSessionModel");
const appResponse_1 = require("src/utils/appResponse");
const catchAsync_1 = __importDefault(require("src/utils/catchAsync"));
//CREATE A NEW SESSION
exports.createAcedemicSession = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, start, end } = req.body;
    if (!name || !start || !end) {
        return next(new appError_1.AppError("Please provide the required field to create this session", 422));
    }
    const sessionExist = yield acedemicSessionModel_1.AcedemicSession.findOne({ start, end });
    if (sessionExist) {
        return next(new appError_1.AppError("This acedemic session you are trying to create already exist.", 400));
    }
    const newSession = yield acedemicSessionModel_1.AcedemicSession.create({ name, start, end });
    if (!newSession) {
        return next(new appError_1.AppError("Could not create this session. please try again", 400));
    }
    return (0, appResponse_1.AppResponse)(res, 200, "success", "New session successfully created", newSession);
}));
//FETCH COURSES OFFERED ACCROSS ALL LEVEL
exports.fetchAllAcedemicSession = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const allAcedemicSession = yield acedemicSessionModel_1.AcedemicSession.find();
    if (!allAcedemicSession) {
        return next(new appError_1.AppError("Could Not fetch all acedemic session.", 400));
    }
    return (0, appResponse_1.AppResponse)(res, 200, "success", "all acedemic session successfully fteched", allAcedemicSession);
}));
//DELETE A PARTICULAR ACEDEMIC SESSION USING ITS ID
exports.deleteAcedemicSession = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield acedemicSessionModel_1.AcedemicSession.findByIdAndDelete(id);
    return (0, appResponse_1.AppResponse)(res, 200, "success", "An Acedemic session successfully deleted.", null);
}));
