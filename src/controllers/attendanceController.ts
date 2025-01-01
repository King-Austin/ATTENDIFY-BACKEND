import { AppError } from "src/errors/appError";
import { AcedemicSession } from "src/models/acedemicSessionModel";
import { Attendance } from "src/models/attendanceModel";
import { Course } from "src/models/courseModel";
import { Students } from "src/models/studentModel";
import { AppResponse } from "src/utils/appResponse";
import catchAsync from "src/utils/catchAsync";

export const createAttendance = catchAsync(async (req, res, next) => {
  const { course, acedemicSession, semester, level } = req.body;

  // Step 1: Validate inputs and fetch related data
  const studentsOfferingTheCourse = await Students.find({ level });

  if (!studentsOfferingTheCourse || studentsOfferingTheCourse.length === 0) {
    return next(
      new AppError("Could not find students offering this course.", 404)
    );
  }

  const theCourseAcedemicSession = await AcedemicSession.findById(
    acedemicSession
  );

  if (!theCourseAcedemicSession) {
    return next(
      new AppError(
        "The academic session that you selected does not exist in the database any longer.",
        404
      )
    );
  }

  const theCourse = await Course.findById(course);

  if (!theCourse) {
    return next(new AppError("This course does not exist.", 404));
  }

  // Step 2: Prepare the `students` array for the attendance record
  const students = studentsOfferingTheCourse.map((student) => ({
    studentId: student._id,
    name: student.name,
    regNo: student.regNo,
    level: student.level,
    fingerPrint: student.fingerPrint,
    addmissionYear: student.addmissionYear,
    attendanceStatus: [], // Initially empty; will be updated when attendance is activated
  }));

  // Step 3: Create the attendance record
  const newAttendance = await Attendance.create({
    course,
    acedemicSession,
    semester,
    level,
    students,
  });

  // Step 4: Send a success response

  return AppResponse(
    res,
    200,
    "success",
    `Attendance for ${theCourse.courseCode} successfully created.`,
    newAttendance
  );
});
