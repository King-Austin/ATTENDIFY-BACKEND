import { AppError } from "src/errors/appError";
import { AcedemicSession } from "src/models/acedemicSessionModel";
import { AppResponse } from "src/utils/appResponse";
import catchAsync from "src/utils/catchAsync";


//CREATE A NEW SESSION
export const createAcedemicSession = catchAsync(async (req, res, next) => {
  const { name, start, end } = req.body;

  if (!name || !start || !end) {
    return next(
      new AppError(
        "Please provide the required field to create this session",
        422
      )
    );
  }

  const sessionExist = await AcedemicSession.findOne({ start, end });

  if (sessionExist) {
    return next(
      new AppError(
        "This acedemic session you are trying to create already exist.",
        400
      )
    );
  }

  const newSession = await AcedemicSession.create({ name, start, end });

  if (!newSession) {
    return next(
      new AppError("Could not create this session. please try again", 400)
    );
  }

  return AppResponse(
    res,
    200,
    "success",
    "New session successfully created",
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
