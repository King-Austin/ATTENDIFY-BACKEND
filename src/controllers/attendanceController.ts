import catchAsync from "src/utils/catchAsync";

export const createAttendance = catchAsync(async (req, res, next) => {
  const { course, acedemicSession, semester,  status, level } =
        req.body;
    
    
});
