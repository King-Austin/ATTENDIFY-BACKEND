import { AppError } from "src/errors/appError";
import Activity from "src/models/activitiesModel";
import { activityType } from "src/types/types";
import { AppResponse } from "src/utils/appResponse";
import catchAsync from "src/utils/catchAsync";

//ACTIVITY CONTROLLER
export const createActivitiesController = async (activityData: activityType) => {
    
 
    try {
        const newActivity = await Activity.create(activityData)
        console.log('Activity logged successfully:', newActivity); // Debugging
    } catch (error) {
        console.error('Error logging activity:', error); // Debugging
        throw new Error('Failed to log activity');
    }
}; 




export const fetchAllActivities = catchAsync(async (req, res, next) => {
    const AllActivities = await Activity.find()

    if (!AllActivities) {
        return next(new AppError("Could not fetch activities. please try again", 400))
    }
 
   AppResponse(res, 200, "success", "Activities successfuly fetched.", AllActivities)
})
 



exports.deleteAllTheactivities = catchAsync(async (req, res, next) => {
    
    await Activity.deleteMany();

    res.status(200).json({
        status: "successful",
        message: 'all activities successfully deleted'
    })

})