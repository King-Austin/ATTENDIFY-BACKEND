"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const activitiesSchema = new Schema({
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
}, { timestamps: true });
const Activity = mongoose_1.default.model("activities", activitiesSchema);
exports.default = Activity;
