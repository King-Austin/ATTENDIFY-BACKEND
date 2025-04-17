import mongoose from "mongoose";
import { activityType } from "../types/types";
const { Schema } = mongoose;

const activitiesSchema = new Schema<activityType>(
  {
    userName: {
      type: String,
      required: [true, "Activity must belong to a user"],
    },
    userRole: {
      type: String,
      required: [true, "user must have role"],
    },
    action: {
      type: String,
      required: [true, "Please input the action that was performed."],
    },
  },
  { timestamps: true }
);

const Activity = mongoose.model("activities", activitiesSchema);

export default Activity;
