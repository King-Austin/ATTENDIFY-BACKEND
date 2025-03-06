import { AppError } from "src/errors/appError";
import { AcedemicSession } from "src/models/acedemicSessionModel";
import { Attendance } from "src/models/attendanceModel";
import { Course } from "src/models/courseModel";
import { Students } from "src/models/studentModel";
import { AppResponse } from "src/utils/appResponse";
import catchAsync from "src/utils/catchAsync";

//CREATE ATTENDANCE
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

// Activate attendance and mark all students as absent for the day
export const activateAttendance = catchAsync(async (req, res, next) => {

  const { attendanceId } = req.params;

  // Find the attendance record for the specific course
  const attendanceRecord = await Attendance.findById(attendanceId)
    .populate("course")
    .populate("acedemicSession");

  if (!attendanceRecord) {
    return next(
      new AppError("Attendance record not found for the course.", 404)
    );
  }

  if (attendanceRecord.active) {
    return next(
      new AppError("Attendance is already active for this course.", 400)
    );
  }

  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  // Mark all students as absent for today, but only if they don't already have an attendance record for today
  attendanceRecord.students.forEach((student) => {
    const alreadyMarked = student.attendanceStatus.some(
      (record: any) => record.date.toISOString().split("T")[0] === today
    );

    if (!alreadyMarked) {
      student.attendanceStatus.push({
        date: new Date(),
        status: "absent",
      });
    }
  });

  // Activate the attendance
  attendanceRecord.active = true;
  await attendanceRecord.save();

  return AppResponse(
    res,
    200,
    "success",
    `Attendance activated for students to mark`,
    attendanceRecord
  );
});

//MARK ATTENDANCE
export const markAttendance = catchAsync(async (req, res, next) => {
  const { attendanceId } = req.params;
  const { fingerprint, regNo } = req.body; // Include level in the request body

  // Find the attendance record
  const attendance = await Attendance.findById(attendanceId);

  if (!attendance) {
    return next(new AppError("Attendance not found.", 404));
  }

  // Check if the attendance is active
  if (!attendance.active) {
    return next(new AppError("Attendance is not active.", 400));
  }

  // // Check if the level in the request matches the level in the attendance record
  // if (attendance.level !== level) {
  //   return next(
  //     new AppError("Attendance cannot be marked for this level.", 400)
  //   );
  // }

  // Find the student by matching the fingerprint
  const student = attendance.students.find(
    (student) => student.fingerPrint === fingerprint || student.regNo === regNo
  );

  if (!student) {
    return next(
      new AppError(
        "Student not found with the reg no or fingerprint mismatch.",
        404
      )
    );
  }

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Check if the student is marked absent for today
  const attendanceRecordIndex = student.attendanceStatus.findIndex(
    (record: any) =>
      record.date.toISOString().split("T")[0] === today &&
      record.status === "absent"
  );

  if (attendanceRecordIndex === -1) {
    return next(
      new AppError("No absent record found for today to update.", 400)
    );
  }

  // Update the status to "present"
  student.attendanceStatus[attendanceRecordIndex].status = "present";

  // Save the updated attendance record
  await attendance.save();

  return AppResponse(
    res,
    200,
    "success",
    `Attendance successfully taken.`,
    student
  );
});

//MARK ABSENT
export const markAbsent = catchAsync(async (req, res, next) => {
  const { attendanceId } = req.params;
  const { fingerprint, level, regNo } = req.body; // Include level in the request body

  // Find the attendance record
  const attendance = await Attendance.findById(attendanceId);

  if (!attendance) {
    return next(new AppError("Attendance not found.", 404));
  }

  // Check if the attendance is active
  if (!attendance.active) {
    return next(new AppError("Attendance is not active.", 400));
  }

  // // Check if the level in the request matches the level in the attendance record
  // if (attendance.level !== level) {
  //   return next(
  //     new AppError("Attendance cannot be marked for this level.", 400)
  //   );
  // }

  // Find the student by matching the fingerprint
  const student = attendance.students.find(
    (student) => student.fingerPrint === fingerprint || student.regNo === regNo
  );

  if (!student) {
    return next(
      new AppError(
        "Student not found with the reg no or fingerprint mismatch.",
        404
      )
    );
  }

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Check if the student is already marked as absent for today
  const attendanceRecordIndex = student.attendanceStatus.findIndex(
    (record: any) =>
      record.date.toISOString().split("T")[0] === today &&
      record.status === "absent"
  );

  if (attendanceRecordIndex !== -1) {
    return next(
      new AppError("Student is already marked as absent for today.", 400)
    );
  }

  // Add a new record to mark the student as "absent"
  student.attendanceStatus.push({
    date: new Date(),
    status: "absent",
  });

  // Save the updated attendance record
  await attendance.save();

  return AppResponse(
    res,
    200,
    "success",
    `Attendance successfully marked as absent.`,
    student
  );
});

//DEACTIVATE ATTENDANCE
export const deactivateAttendance = catchAsync(async (req, res, next) => {
  const { attendanceId } = req.params;

  const attendance = await Attendance.findById(attendanceId);
  if (!attendance) {
    return next(new AppError("Attendance not found.", 404));
  }

  if (!attendance.active) {
    return next(new AppError("Attendance is already inactive.", 400));
  }

  attendance.active = false;
  await attendance.save();

  return AppResponse(
    res,
    200,
    "success",
    `Attendance deactivated successfully.`,
    attendance
  );
});

//FETCH ATTENDANCE BY SESSION
export const fetchAllAttendance = catchAsync(async (req, res, next) => {
  // Fetch all attendance records for the specified academic session
  const attendanceRecords = await Attendance.find()
    .populate("course")
    .populate("acedemicSession");

  return AppResponse(
    res,
    200,
    "success",
    `Attendance fetched successfully.`,
    attendanceRecords
  );
});

//DELETE ATTENDANCE BY ID
export const deleteAttendanceByID = catchAsync(async (req, res, next) => {
  const { attendanceId } = req.params;

  const attendance = await Attendance.findById(attendanceId);
  if (!attendance) {
    return next(new AppError("Attendance not found.", 404));
  }

  await Attendance.findByIdAndDelete(attendanceId);

  return AppResponse(
    res,
    200,
    "success",
    `Attendance deleted successfully.`,
    null
  );
});

//FETCH ATTENDANCE BY SESSION
export const fetchAttendanceBySession = catchAsync(async (req, res, next) => {
  const { sessionId } = req.params; // Academic session ID passed as parameter

  // Find the academic session by ID
  const academicSession = await AcedemicSession.findById(sessionId);
  if (!academicSession) {
    return next(new AppError("Academic session not found.", 404));
  }

  // Fetch all attendance records for the specified academic session
  const attendanceRecords = await Attendance.find({
    acedemicSession: sessionId,
  }).populate("course"); // populate the course details

  if (!attendanceRecords || attendanceRecords.length === 0) {
    return next(
      new AppError(
        "No attendance records found for this academic session.",
        404
      )
    );
  }

  return AppResponse(
    res,
    200,
    "success",
    `Attendance fetched successfully.`,
    attendanceRecords
  );
});

//ADD STUDENT TO ATTENDANCE
export const addStudentToTheAttendance = catchAsync(async (req, res, next) => {
  const { attendanceId } = req.params; // Attendance ID
  const { studentId } = req.body;

  // Find the attendance record
  const theAttendance = await Attendance.findById(attendanceId);
  const theStudent = await Students.findById(studentId);

  if (!theAttendance) {
    return next(new AppError("This attendance does not exist.", 404));
  }

  if (!theStudent) {
    return next(
      new AppError("This student does not exist. Kindly add the student.", 404)
    );
  }

  // Check if the student is already in the attendance list
  const studentExists = theAttendance.students.some(
    (student) => student.studentId.toString() === studentId
  );

  if (studentExists) {
    return next(
      new AppError("Student is already added to this attendance.", 400)
    );
  }

  // Create the student object
  const newStudent: any = {
    studentId: theStudent.id,
    name: theStudent.name,
    regNo: theStudent.regNo,
    level: theStudent.level,
    fingerPrint: theStudent.fingerPrint,
    addmissionYear: theStudent.addmissionYear,
    attendanceStatus: [], // Initially empty
  };

  // Add the new student to the attendance list
  theAttendance.students.push(newStudent);

  // Save the updated attendance record
  await theAttendance.save();

  return AppResponse(
    res,
    200,
    "success",
    "Student successfully added to attendance.",
    theAttendance
  );
});

//DELETE ALL ATTENDANCE
export const deleteAllTheAttendance = catchAsync(async (req, res, next) => {
  await Attendance.deleteMany();

  return AppResponse(
    res,
    200,
    "success",
    "An Acedemic session successfully deleted.",
    null
  );
});

// export const getAttendanceWithPagination = catchAsync(async (req, res, next) => {
//   const { sessionId } = req.params; // Academic session ID passed as parameter
//   const { page = 1, limit = 10 } = req.query; // Pagination parameters with default values

//   // Validate academic session existence
//   const academicSession = await AcedemicSession.findById(sessionId);
//   if (!academicSession) {
//     return next(new AppError("Academic session not found.", 404));
//   }

//   // Pagination calculation
//   const skip = (page - 1) * limit;

//   // Fetch attendance records with pagination
//   const attendanceRecords = await Attendance.find({ acedemicSession: sessionId })
//     .skip(skip)
//     .limit(Number(limit))
//     .populate('course') // Optional: populate the course details
//     .populate('students.studentId'); // Optional: populate student details

//   // Count total records for pagination metadata
//   const totalRecords = await Attendance.countDocuments({ acedemicSession: sessionId });

//   // Handle case when no records are found
//   if (!attendanceRecords || attendanceRecords.length === 0) {
//     return next(new AppError("No attendance records found for this academic session.", 404));
//   }

//   res.status(200).json({
//     status: "success",
//     data: attendanceRecords,
//     pagination: {
//       totalRecords,
//       totalPages: Math.ceil(totalRecords / limit),
//       currentPage: Number(page),
//       pageSize: Number(limit),
//     },
//   });
// });
