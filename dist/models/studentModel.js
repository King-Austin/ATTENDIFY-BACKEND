"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const StudentSchema = new Schema({
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
});
