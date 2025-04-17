import mongoose, { model } from "mongoose";
import { studentType } from "../types/types";

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
    fingerPrint: {
        type: String,
        required: [true, "Please input the student fingerprint"]
    },
    email: {
        type: String,
        required: [true, "Please input the student email"]
    },
})

export const Students = model("students", StudentSchema)