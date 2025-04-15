import mongoose, { model } from "mongoose";
import { sessionType } from "src/types/types";

const { Schema } = mongoose;

const sessionSchema = new Schema<sessionType>({
  name: {
    type: String,
    required: [true, "Please provide the name of this session"],
    unique: true,
  }, 
  start: {
    type: Date,
    required: [true, "Please provide date that this session starts."],
    unique: true,
  },
  end: {
    type: Date,
    required: [true, "Please provide date that this session ends."],
    unique: true,
  },
  semesters: {
    type: [String],
    required: [true, "Please provide the semesters in this session"],
    default: ["first semester", "second semester"],
  },
  attendance: {
    type: [Schema.ObjectId],
    default: [],
    ref: "Attendance",
  },
  active: {
    type: Boolean,
    required: [true, "Please provide the status of this acedemic session"],
    default: true,
  },
});

export const AcedemicSession = model("AcedemicSession", sessionSchema);
