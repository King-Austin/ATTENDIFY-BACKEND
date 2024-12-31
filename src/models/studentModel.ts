import mongoose from "mongoose";
import { studentType } from "src/types/types";



const { Schema } = mongoose;

const StudentSchema = new Schema<studentType>({
    name: {
        type: String,
        required: [true, "Please input the student name"]
    },
    regNo: {
        type: Number,
        required: [true, "Please input the student registration number"]
    },
    level: {
        type: String,
        required: [true, "Please input the student leve"]
    },
    addmissionYear: {
        type: String,
        required: [true, "Please input the student year of admission"]
    },
    course: {
        type: [Schema.ObjectId],
        required: [true, "Please input the student name"]
    },
    fingerPrint: {
        type: String,
        required: [true, "Please input the student name"]
    },
})