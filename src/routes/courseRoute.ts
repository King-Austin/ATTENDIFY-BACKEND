import express from "express";
import {
  protectedRoute,
  restrictedRoute,
} from "src/controllers/authController";
import {
  addNewCourse,
  deleteACourse,
  fetchAllCourse,
  fetchCourseByLevel,
  fetchCourseBySemester,
} from "src/controllers/courseController";

const router = express.Router();

router
  .route("/addANewCourse")
  .post(protectedRoute, restrictedRoute(["admin"]), addNewCourse);

router.route("/fetchAllCourse").get(fetchAllCourse);

router.route("/fetchCoursesByLevel/:level").get(fetchCourseByLevel);

router.route("/fetchCoursesBySemester/:semester").get(fetchCourseBySemester);

router
  .route("/deleteACourse/:id")
  .delete(protectedRoute, restrictedRoute(["admin"]), deleteACourse);

export default router;
