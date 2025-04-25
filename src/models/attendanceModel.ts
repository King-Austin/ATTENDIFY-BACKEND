import mongoose, { model } from "mongoose";
import { attendanceType } from "../types/types";

const { Schema } = mongoose;

const attendanceSchema = new Schema<attendanceType>(
  {
    course: {
      courseTitle: {
        type: String,
      },
      courseCode: {
        type: String,
      },
      semester: {
        type: String,
      },
      level: {
        type: String,
      },
      id: {
        type: Schema.ObjectId, required: true
      },
    },
    acedemicSession: {
      name: {
        type: String,
      },
      start: {
        type: Date,
      },
      end: {
        type: Date,
      },
      semesters: {
        type: [String],
      },
      active: {
        type: Boolean,
        default: true,
      },
      id: {
        type: Schema.ObjectId, required: true
      }
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
    active: {
      type: Boolean,
      default: false, // Indicates if attendance is active for the course
    },
    students: [
      {
        studentId: { type: String, required: true },
        name: { type: String, required: true },
        regNo: { type: String, required: true },
        level: { type: String, required: true },
        fingerPrint: { type: String, required: true },
        addmissionYear: { type: String, required: true },
        attendanceStatus: [
          {
            date: { type: Date, required: true },
            status: {
              type: String,
              enum: ["present", "absent"],
              default: "absent",
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export const Attendance = model("Attendance", attendanceSchema);
