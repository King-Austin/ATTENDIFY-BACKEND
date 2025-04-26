"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwaggerDocs = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Academic Attendance Management System API",
            version: "1.0.0",
            description: "API for managing users, courses, attendance, and sessions.",
        },
        servers: [
            {
                url: process.env.BACKEND_URL,
            },
        ],
        components: {
            schemas: {
                user: {
                    type: "object",
                    required: [
                        "fullName",
                        "email",
                        "password",
                        "role",
                        "emailVerified",
                        "active",
                    ],
                    properties: {
                        id: {
                            type: "string",
                            description: "Unique identifier (MongoDB ObjectId)",
                        },
                        fullName: { type: "string", description: "Full name of the user" },
                        email: {
                            type: "string",
                            format: "email",
                            description: "User email address",
                        },
                        password: { type: "string", description: "User password (hashed)" },
                        role: {
                            type: "string",
                            description: "Role of the user (e.g., admin, student)",
                        },
                        emailVerified: {
                            type: "boolean",
                            description: "Indicates if the user's email is verified",
                        },
                        active: {
                            type: "boolean",
                            description: "Indicates if the user account is active",
                        },
                        access: { type: "string", description: "Access level of the user" },
                    },
                },
                course: {
                    type: "object",
                    required: ["courseTitle", "courseCode", "semester", "level"],
                    properties: {
                        id: {
                            type: "string",
                            description: "Unique identifier (MongoDB ObjectId)",
                        },
                        courseTitle: { type: "string", description: "Title of the course" },
                        courseCode: { type: "string", description: "Code of the course" },
                        semester: {
                            type: "string",
                            description: "Semester the course is offered",
                        },
                        level: {
                            type: "string",
                            description: "Academic level for the course",
                        },
                    },
                },
                student: {
                    type: "object",
                    required: [
                        "name",
                        "regNo",
                        "level",
                        "course",
                        "fingerPrint",
                        "admissionYear",
                    ],
                    properties: {
                        id: {
                            type: "string",
                            description: "Unique identifier (MongoDB ObjectId)",
                        },
                        name: { type: "string", description: "Full name of the student" },
                        regNo: {
                            type: "string",
                            description: "Registration number of the student",
                        },
                        level: {
                            type: "string",
                            description: "Academic level of the student",
                        },
                        course: {
                            type: "array",
                            items: {
                                type: "string",
                                description: "Course ID (MongoDB ObjectId)",
                            },
                            description: "Courses the student is enrolled in",
                        },
                        fingerPrint: {
                            type: "string",
                            description: "Fingerprint data of the student",
                        },
                        admissionYear: { type: "string", description: "Year of admission" },
                    },
                },
                session: {
                    type: "object",
                    required: ["name", "start", "end", "semesters", "attendance"],
                    properties: {
                        id: {
                            type: "string",
                            description: "Unique identifier (MongoDB ObjectId)",
                        },
                        name: { type: "string", description: "Name of the session" },
                        start: {
                            type: "string",
                            format: "date-time",
                            description: "Start date of the session",
                        },
                        end: {
                            type: "string",
                            format: "date-time",
                            description: "End date of the session",
                        },
                        semesters: {
                            type: "array",
                            items: { type: "string" },
                            description: "Semesters included in the session",
                        },
                        attendance: {
                            type: "array",
                            items: {
                                type: "string",
                                description: "Attendance record ID (MongoDB ObjectId)",
                            },
                            description: "Attendance records for the session",
                        },
                    },
                },
                attendance: {
                    type: "object",
                    required: [
                        "course",
                        "academicSession",
                        "semester",
                        "students",
                        "active",
                        "level",
                    ],
                    properties: {
                        id: {
                            type: "string",
                            description: "Unique identifier (MongoDB ObjectId)",
                        },
                        course: {
                            type: "string",
                            description: "Course ID (MongoDB ObjectId)",
                        },
                        academicSession: {
                            type: "string",
                            description: "Academic session ID (MongoDB ObjectId)",
                        },
                        semester: {
                            type: "string",
                            description: "Semester for the attendance record",
                        },
                        students: {
                            type: "array",
                            items: { $ref: "#/components/schemas/student" },
                            description: "Students associated with the attendance record",
                        },
                        active: {
                            type: "boolean",
                            description: "Indicates if attendance is active",
                        },
                        level: {
                            type: "string",
                            description: "Level of students in the attendance record",
                        },
                    },
                },
            },
        },
    },
    apis: ["./dist/routes/*.js"], // point to your route files
};
// Initialize swagger-jsdoc with options
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
// Swagger setup function to be used
const setupSwaggerDocs = (app) => {
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec, {
        // customCssUrl:
        //"https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",
        swaggerUrl: "https://cdn.jsdelivr.net/npm/swagger-ui-dist@3.52.5/swagger-ui-bundle.js",
    }));
};
exports.setupSwaggerDocs = setupSwaggerDocs;
