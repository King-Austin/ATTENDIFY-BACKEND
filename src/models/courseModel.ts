import mongoose, { model } from "mongoose";
import { courseType } from "../types/types";

const { Schema } = mongoose;

const courseSchema = new Schema<courseType>({
  courseTitle: {
    type: String,
    required: [true, "Please provide the course tilte"],
    unique: true,
  },
  courseCode: {
    type: String,
    required: [true, "Kindly provide the course code"],
    unique: true,
  },
  semester: {
    type: String,
    required: [true, "Kindly provide the semester this course is offered"],
    enum: ["first semester", "second semester"],
  },
  level: {
    type: String,
    required: [true, "Kindly provide the course code"],
    enum: ["100", "200", "300", "400", "500"],
  },
});

export const Course = model("courses", courseSchema);
