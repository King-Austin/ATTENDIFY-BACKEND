"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attendance = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const { Schema } = mongoose_1.default;
const attendanceSchema = new Schema({
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
    active: {
        type: Boolean,
        default: false, // Indicates if attendance is active for the course
    },
    students: [
        {
            studentId: { type: Schema.ObjectId, required: true },
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
}, { timestamps: true });
exports.Attendance = (0, mongoose_1.model)("Attendance", attendanceSchema);
