import express from "express";
import {
  protectedRoute,
  restrictedRoute,
} from "src/controllers/authController";
import {
  createStudent,
  deleteAStudent,
  fetchAllTheStudents,
  fetchStudentByLevel,
  fetchStudentByYearOfAdmission,
  updateStudentData,
} from "src/controllers/studentController";

const router = express.Router();

router
  .route("/createStudent")
  .post(protectedRoute, restrictedRoute(["admin"]), createStudent);

router.route("/fetchAllTheStudents").get(fetchAllTheStudents);

router
  .route("/fetchStudentByYearOfAdmission")
  .get(fetchStudentByYearOfAdmission);

router.route("/fetchStudentByLevel").get(fetchStudentByLevel);

router.route("/updateStudentData").patch(updateStudentData);

router.route("/deleteAStudent").post(deleteAStudent);

export default router;
