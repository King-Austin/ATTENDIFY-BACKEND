import { AppError } from "src/errors/appError";
import { Course } from "src/models/courseModel";
import { AppResponse } from "src/utils/appResponse";
import catchAsync from "src/utils/catchAsync";

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

  return AppResponse(
    res,
    200,
    "success",
    "A course successfully deleted",
    null
  );
});
