import { AppError } from "src/errors/appError";
import { Students } from "src/models/studentModel";
import { AppResponse } from "src/utils/appResponse";
import catchAsync from "src/utils/catchAsync";

//CREATE A NEW STUDENT
export const createStudent = catchAsync(async (req, res, next) => {
  const { name, regNo, level, fingerPrint, addmissionYear } = req.body;

  if (!name || !regNo || !level || !fingerPrint || !addmissionYear) {
    return next(new AppError("Please fill in the required field", 422));
  }

  const studentExist = await Students.findOne({ regNo });

  if (studentExist) {
    return next(
      new AppError("Student already exist with the registrationj number", 400)
    );
  }

  const newStudent = await Students.create({
    name,
    regNo,
    level,
    fingerPrint,
    addmissionYear,
  });

  if (!newStudent) {
    return next(
      new AppError("Could not create student. Please try again", 400)
    );
  }

  return AppResponse(
    res,
    201,
    "success",
    "Student successfully created",
    newStudent
  );
});

//FETCH ALL THE STUDENT
export const fetchAllTheStudents = catchAsync(async (req, res, next) => {
  const allTheStudent = await Students.find();

  if (!allTheStudent) {
    return next(
      new AppError("Could not fetch all the student. Please try again", 400)
    );
  }

  return AppResponse(
    res,
    200,
    "success",
    "students successfully fetched.",
    allTheStudent
  );
});

//FETCH STUDENTS BY YEAR OF ADMISSION
export const fetchStudentByYearOfAdmission = catchAsync(
  async (req, res, next) => {
    const { addmissionYear } = req.params;

    if (!addmissionYear) {
      return next(new AppError("Kindly provide the year of admission", 400));
    }

    const students = await Students.find({ addmissionYear });

    if (!students) {
      return next(
        new AppError(
          `Could not fetch students given addmission on ${addmissionYear}. Please try again`,
          400
        )
      );
    }

    return AppResponse(
      res,
      200,
      "success",
      `Students admitted on ${addmissionYear} successfully fetch`,
      students
    );
  }
);

//FETCH STUDENTS BY LEVEL
export const fetchStudentByLevel = catchAsync(async (req, res, next) => {
  const { level } = req.params;

  if (!level) {
    return next(new AppError("Kindly provide the year of admission", 400));
  }

  const students = await Students.find({ level });

  if (!students) {
    return next(
      new AppError(
        `Could not fetch students in ${level} level. Please try again`,
        400
      )
    );
  }

  return AppResponse(
    res,
    200,
    "success",
    `Students in ${level} level successfully fetched.`,
    students
  );
});

//FETCH STUDENTS BY LEVEL
export const fetchStudentByID = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("Kindly provide the ID of the student", 400));
  }

  const student = await Students.findById(id);

  if (!student) {
    return next(
      new AppError(
        `Could not fetch the student with this ID. Please try again`,
        400
      )
    );
  }

  return AppResponse(
    res,
    200,
    "success",
    `Student successfully fetched.`,
    student
  );
});

//UPDATE A STUDENT DATA
export const updateStudentData = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const { name, regNo, level, course, fingerPrint, addmissionYear } = req.body;

  if (!name || !regNo || !level || !course || !fingerPrint || !addmissionYear) {
    return next(new AppError("Please fill in the required field", 422));
  }

  const student = await Students.findByIdAndUpdate(
    id,
    {
      name,
      regNo,
      level,
      course,
      fingerPrint,
      addmissionYear,
    },
    { runValidators: false, new: true }
  );

  return AppResponse(
    res,
    200,
    "success",
    "Student data successfully updated",
    student
  );
});

//DELETE A PARTICULAR STUDENT USING ITS ID
export const deleteAStudent = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  await Students.findByIdAndDelete(id);

  return AppResponse(
    res,
    200,
    "success",
    "Student data successfully deleted",
    null
  );
});
