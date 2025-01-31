import { AppError } from "src/errors/appError";
import { AcedemicSession } from "src/models/acedemicSessionModel";
import { AppResponse } from "src/utils/appResponse";
import catchAsync from "src/utils/catchAsync";
import { Students } from "src/models/studentModel";

// // CREATE A NEW SESSION
// export const createAcedemicSession = catchAsync(async (req, res, next) => {
//   const { name, start, end } = req.body;

//   // Fetch all students
//   const students = await Students.find();

//   if (!name || !start || !end) {
//     return next(
//       new AppError(
//         "Please provide the required fields to create this session",
//         422
//       )
//     );
//   }

//   // Check if the session already exists
//   const sessionExist = await AcedemicSession.findOne({ start, end });

//   if (sessionExist) {
//     return next(
//       new AppError(
//         "This academic session you are trying to create already exists.",
//         400
//       )
//     );
//   }

//   // Create new session
//   const newSession = await AcedemicSession.create({ name, start, end });

//   if (!newSession) {
//     return next(
//       new AppError("Could not create this session. Please try again.", 400)
//     );
//   }

//   // Promote students to the next level
//   for (const student of students) {
//     if (student.level === "100") {
//       student.level = "200";
//     } else if (student.level === "200") {
//       student.level = "300";
//     } else if (student.level === "300") {
//       student.level = "400";
//     } else if (student.level === "400") {
//       student.level = "500";
//     } else if (student.level === "500") {
//       student.level = "graduated"; // Mark students as graduated
//     }

//     await student.save(); // Save the updated student level
//   }

//   return AppResponse(
//     res,
//     200,
//     "success",
//     "New session successfully created and students promoted",
//     newSession
//   );
// });

// CREATE A NEW SESSION
export const createAcedemicSession = catchAsync(async (req, res, next) => {
  const { name, start, end } = req.body;

  // Fetch all students
  const students = await Students.find();

  if (!name || !start || !end) {
    return next(
      new AppError(
        "Please provide the required fields to create this session",
        422
      )
    );
  }

  // Check if the session dates fall within any existing session
  const overlappingSession = await AcedemicSession.findOne({
    $or: [
      { start: { $lte: start }, end: { $gte: start } }, // Check if the start date overlaps
      { start: { $lte: end }, end: { $gte: end } }, // Check if the end date overlaps
      { start: { $gte: start }, end: { $lte: end } }, // Check if the session is fully within another session
    ],
  });

  if (overlappingSession) {
    return next(
      new AppError(
        "There's another academic session within or overlapping with this date range.",
        400
      )
    );
  }

  // Create new session
  const newSession = await AcedemicSession.create({ name, start, end });

  if (!newSession) {
    return next(
      new AppError("Could not create this session. Please try again.", 400)
    );
  }

  // Set all existing active sessions to false
  await AcedemicSession.updateMany({ active: true }, { active: false });

  // Set the new session as active
  newSession.active = true;
  await newSession.save();

  // Promote students to the next level
  for (const student of students) {
    if (student.level === "100") {
      student.level = "200";
    } else if (student.level === "200") {
      student.level = "300";
    } else if (student.level === "300") {
      student.level = "400";
    } else if (student.level === "400") {
      student.level = "500";
    } else if (student.level === "500") {
      student.level = "graduated"; // Mark students as graduated
    }

    await student.save(); // Save the updated student level
  }

  return AppResponse(
    res,
    200,
    "success",
    "New session successfully created and students promoted",
    newSession
  );
});

//FETCH ALL ACEDEMIC SESSION
export const fetchAllAcedemicSession = catchAsync(async (req, res, next) => {
  const allAcedemicSession = await AcedemicSession.find();

  if (!allAcedemicSession) {
    return next(new AppError("Could Not fetch all acedemic session.", 400));
  }

  return AppResponse(
    res,
    200,
    "success",
    "all acedemic session successfully fteched",
    allAcedemicSession
  );
});

//FETCH A PARTICULAR ACEDEMIC SESSION USING ITS ID
export const fetchAcedemicSessionByID = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const particularSession = await AcedemicSession.findById(id);

  if (!particularSession) {
    return next(new AppError("No acedemic session exist with this ID", 404));
  }

  return AppResponse(
    res,
    200,
    "success",
    "An Acedemic session successfully fetched.",
    particularSession
  );
});

//DELETE A PARTICULAR ACEDEMIC SESSION USING ITS ID
export const deleteAcedemicSession = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  await AcedemicSession.findByIdAndDelete(id);

  return AppResponse(
    res,
    200,
    "success",
    "An Acedemic session successfully deleted.",
    null
  );
});

//DELETE ALL ACEDEMIC SESSION
export const deleteAllAcedemicSessions = catchAsync(async (req, res, next) => {
  await AcedemicSession.deleteMany();

  return AppResponse(
    res,
    200,
    "success",
    "An Acedemic session successfully deleted.",
    null
  );
});
