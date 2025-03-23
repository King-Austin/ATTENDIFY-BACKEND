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
exports.AcedemicSession = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const { Schema } = mongoose_1.default;
const sessionSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please provide the name of this session"],
        unique: true,
    },
    start: {
        type: String,
        required: [true, "Please provide date that this session starts."],
        unique: true,
    },
    end: {
        type: String,
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
exports.AcedemicSession = (0, mongoose_1.model)("AcedemicSession", sessionSchema);
