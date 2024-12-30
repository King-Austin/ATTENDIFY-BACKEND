"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("src/controllers/authController");
const courseController_1 = require("src/controllers/courseController");
const router = express_1.default.Router();
router
    .route("/addANewCourse")
    .post(authController_1.protectedRoute, (0, authController_1.restrictedRoute)(["admin"]), courseController_1.addNewCourse);
router.route("/fetchAllCourse").get(courseController_1.fetchAllCourse);
router.route("/fetchCoursesByLevel/:level").get(courseController_1.fetchCourseByLevel);
router.route("/fetchCoursesBySemester/:semester").get(courseController_1.fetchCourseBySemester);
router
    .route("/deleteACourse/:id")
    .delete(authController_1.protectedRoute, (0, authController_1.restrictedRoute)(["admin"]), courseController_1.deleteACourse);
exports.default = router;
