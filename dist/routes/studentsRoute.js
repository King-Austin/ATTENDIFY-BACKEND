"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("src/controllers/authController");
const studentController_1 = require("src/controllers/studentController");
const router = express_1.default.Router();
router
    .route("/createStudent")
    .post(authController_1.protectedRoute, (0, authController_1.restrictedRoute)(["admin"]), studentController_1.createStudent);
router.route("/fetchAllTheStudents").get(studentController_1.fetchAllTheStudents);
router
    .route("/fetchStudentByYearOfAdmission")
    .get(studentController_1.fetchStudentByYearOfAdmission);
router.route("/fetchStudentByLevel").get(studentController_1.fetchStudentByLevel);
router.route("/updateStudentData").patch(studentController_1.updateStudentData);
router.route("/deleteAStudent").post(studentController_1.deleteAStudent);
exports.default = router;
