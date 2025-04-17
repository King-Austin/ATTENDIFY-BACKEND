import { activityType } from "src/types/types";
import { AppError } from "../errors/appError";
import { Course } from "../models/courseModel";
import { AppResponse } from "../utils/appResponse";
import catchAsync from "../utils/catchAsync";
import { createActivitiesController } from "./activitiesController";
import { verifyTokenAndGetUser } from "src/utils/verifyTokenAndGetUser";

//ADD NEW COURSE
export const addNewCourse = catchAsync(async (req, res, next) => {
  const { courseTitle, courseCode, semester, level } = req.body;

  if (!courseTitle || !courseCode || !semester || !level) {
    return next(new AppError("Kindly fill in the required field", 422));
  }

  const newCourse = await Course.create({
    courseTitle,
    courseCode, 
    level,
    semester,
  });

  if (!newCourse) {
    return next(
      new AppError("Could not add this course. Please try agaim", 400)
    );
  }

  const token = req.cookies.jwt;
    
      if (!token) {
        return next(
          new AppError("You are not authorized to perform this action.", 401)
        );
      }
    
      const user = await verifyTokenAndGetUser(token, next);
    
      // if (!user) {
      //   return next(
      //     new AppError(
      //       "Could not find user with this token. please login again.",
      //       404
      //     )
      //   );
      // }
  
    const activityData: activityType = {
      userName: user?.fullName,
      userRole: user?.role,
      action: `${user?.fullName} added a new ${newCourse.level} course. ${newCourse.courseCode}`
    }
    if (user) {
      try {
        createActivitiesController(activityData)
      } catch (error) {
        return next(new AppError("Failed to add activities", 400))
      }
    }

  return AppResponse(
    res,
    200,
    "success",
    "New course successfully added",
    newCourse
  );
});

//FETCH COURSES OFFERED ACCROSS ALL LEVEL
export const fetchAllCourse = catchAsync(async (req, res, next) => {
  const allCourse = await Course.find();

  if (!allCourse) {
    return next(new AppError("Could not fetch all the course", 400));
  }

  return AppResponse(
    res,
    200,
    "success",
    "Course successfully fetched",
    allCourse
  );
});


//FETCH COURSES OFFERED IN A PARTICULAR LEVEL
export const fetchCourseByLevel = catchAsync(async (req, res, next) => {
  const { level } = req.params;

  const course = await Course.find({ level });

  if (!course) {
    return next(
      new AppError(
        `Could not fetch ${level} level courses. Please try again`,
        400
      )
    );
  }

  return AppResponse(
    res,
    200,
    "success",
    `${level} level courses successfully fetched.`,
    course
  );
});

//FETCH COURSES OFFERED IN A PARTICULAR SEMESTER . E.G first semsters courses
export const fetchCourseBySemester = catchAsync(async (req, res, next) => {
  const { semester } = req.params;

  const course = await Course.find({ semester });

  if (!course) {
    return next(
      new AppError(
        `Could not fetch ${semester}  courses. Please try again`,
        400
      )
    );
  }

  return AppResponse(
    res,
    200,
    "success",
    `${semester}  courses successfully fetched.`,
    course
  );
});

//DELETE A PARTICULAR COURSE USING ITS ID
export const deleteACourse = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  await Course.findByIdAndDelete(id);


  const findCourse = await Course.findById(id);

  const token = req.cookies.jwt;
    
      if (!token) {
        return next(
          new AppError("You are not authorized to perform this action.", 401)
        );
      }
    
      const user = await verifyTokenAndGetUser(token, next);
    
      // if (!user) {
      //   return next(
      //     new AppError(
      //       "Could not find user with this token. please login again.",
      //       404
      //     )
      //   );
      // }
  
    const activityData: activityType = {
      userName: user?.fullName,
      userRole: user?.role,
      action: `${user?.fullName} deleted a ${findCourse?.level} course. ${findCourse?.courseCode}`
    }
    if (user) {
      try {
        createActivitiesController(activityData)
      } catch (error) {
        return next(new AppError("Failed to add activities", 400))
      }
    }

  return AppResponse(
    res,
    200,
    "success",
    "A course successfully deleted",
    null
  );
});

//DELETE A PARTICULAR COURSE USING ITS ID
export const deleteAllCourses = catchAsync(async (req, res, next) => {

  await Course.deleteMany();

  return AppResponse(
    res,
    200,
    "success",
    "A course successfully deleted",
    null
  );
});
