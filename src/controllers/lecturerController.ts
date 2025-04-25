import User from "../models/userModel";
import catchAsync from "../utils/catchAsync";
import { AppError } from "../errors/appError";
import { config } from "dotenv";
import { AppResponse } from "../utils/appResponse";

config({ path: "./config.env" });

const { JWT_EXPIRES_IN, JWT_SECRET, JWT_COOKIE_EXPIRES, ORIGIN_URL } =
  process.env;

if (!JWT_EXPIRES_IN || !JWT_SECRET || !JWT_COOKIE_EXPIRES || !ORIGIN_URL) {
  throw new AppError(
    "Kindly make sure that these env variable are defined",
    400
  );
}

//FOR FETCHING ALL THE USER
export const getAllLecturer = catchAsync(async (req, res, next) => {
  const users = await User.find();
  if (!users) {
    return next(new AppError("Something went wrong. Please try again", 400));
  }
  return AppResponse(
    res,
    200,
    "success",
    "fetching lecturers succesful",
    users
  );
});

//FOR FETCHING A USER USING ITS ID
export const getALecturer = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const theUser = await User.findById(id);

  if (!theUser) {
    return next(new AppError("Something went wrong. Please try again", 400));
  }
  return AppResponse(res, 200, "success", "fetching user succesful", theUser);
});

//FOR CREATING A LECTURER, THIS WILL ONLY BE ACCESIBLE TO ADMIN
export const createALecturer = catchAsync(async (req, res, next) => {
  const { fullName, email } = req.body;

  //find user by email
  const userExistWithEmail = await User.findOne({ email });

  const lecturerDetails = {
    fullName,
    email,
    password: `*12345${email}`,
    confirmPassword: `*12345${email}`,
  };

  //if user already exist with the provided email, return an error message
  if (userExistWithEmail) {
    return next(new AppError("user already exist with email", 400));
  }

  if (!fullName || !email) {
    return next(new AppError("Kindly fill in the required field", 400));
  }

  const user = await User.create(lecturerDetails);

  return AppResponse(
    res,
    200,
    "success",
    "Lecturer registration successful.",
    user
  );
});

//FOR UPDATING USER INFO
export const updateLecturer = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userUpdateInfo = req.body;

  if (Object.keys(userUpdateInfo).length === 0) {
    return next(new AppError("No data provided for update", 400));
  }

  if (userUpdateInfo.password || userUpdateInfo.confirmPassword) {
    return next(
      new AppError("This is not the route for updating password", 401)
    );
  }

  const updatedUser = await User.findByIdAndUpdate(id, userUpdateInfo, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    return next(new AppError("User does not exist", 404));
  }

  return AppResponse(
    res,
    200,
    "success",
    "User successfully updated",
    updatedUser
  );
});

export const deleteALecturer = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  return AppResponse(res, 200, "success", "deleted successfully", null);
});
