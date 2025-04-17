import { AppError } from "../errors/appError";
import Activity from "../models/activitiesModel";
import { activityType } from "../types/types";
import { AppResponse } from "../utils/appResponse";
import catchAsync from "../utils/catchAsync";

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