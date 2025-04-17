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
exports.fetchAllActivities = exports.createActivitiesController = void 0;
const appError_1 = require("src/errors/appError");
const activitiesModel_1 = __importDefault(require("src/models/activitiesModel"));
const appResponse_1 = require("src/utils/appResponse");
const catchAsync_1 = __importDefault(require("src/utils/catchAsync"));
//ACTIVITY CONTROLLER
const createActivitiesController = (activityData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newActivity = yield activitiesModel_1.default.create(activityData);
        console.log('Activity logged successfully:', newActivity); // Debugging
    }
    catch (error) {
        console.error('Error logging activity:', error); // Debugging
        throw new Error('Failed to log activity');
    }
});
exports.createActivitiesController = createActivitiesController;
exports.fetchAllActivities = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const AllActivities = yield activitiesModel_1.default.find();
    if (!AllActivities) {
        return next(new appError_1.AppError("Could not fetch activities. please try again", 400));
    }
    (0, appResponse_1.AppResponse)(res, 200, "success", "Activities successfuly fetched.", AllActivities);
}));
exports.deleteAllTheactivities = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield activitiesModel_1.default.deleteMany();
    res.status(200).json({
        status: "successful",
        message: 'all activities successfully deleted'
    });
}));
