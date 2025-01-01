import mongoose, { model } from "mongoose";
import { attendanceType } from "src/types/types";

const { Schema } = mongoose;

const attendanceSchema = new Schema<attendanceType>(
  {
    course: {
      type: Schema.ObjectId,
      ref: "Course",
      required: [true, "Course is required."],
    },
    acedemicSession: {
      type: Schema.ObjectId,
      ref: "acedemicSession",
      required: [true, "Session is required."],
    },
    semester: {
      type: String,
      required: [true, "Semester is required."],
      enum: ["first semester", "second semester"],
    },
    level: {
      type: String,
      required: [true, "Level is required."],
    },
    students: [
      {
        studentId: { type: Schema.ObjectId, required: true },
        attendanceCount: { type: Number, default: 0 },
        name: { type: String, required: true },
        regNo: { type: String, required: true },
        level: { type: String, required: true },
        fingerPrint: { type: String, required: true },
        addmissionYear: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const Attendance = model("Attendance", attendanceSchema);
