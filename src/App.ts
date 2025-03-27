import express, { Response, Request, NextFunction } from "express";
import globalErrorHandler from "./errors/errorController";
import authRoute from "./routes/authRoute";
import acedemicRoute from "./routes/acedemicSessionRoute";
import attendanceRoute from "./routes/attendanceRoute";
import courseRoute from "./routes/courseRoute";
import studentRoute from "./routes/studentsRoute";
import cookieParser from "cookie-parser";
import cors from "cors";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";

import { config } from "dotenv";

config({ path: "./config.env" });

const { ORIGIN_URL } = process.env;

if (!ORIGIN_URL) {
  throw new Error("Make sure that the origin url and the port is defined");
}

console.log("The origin", ORIGIN_URL);

const app = express();
// CORS configuration
const corsOptions = {
  origin: ORIGIN_URL,
  credentials: true,
  methods: "GET,POST,DELETE,PATCH",
  allowedHeaders: "Content-Type, Authorization, api_key",
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(cookieParser());

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("THIS API IS WORKING AS EXPECTED");
});

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Academic Management System API",
      version: "1.0.0",
      description: "API for managing users, courses, attendance, and sessions.",
    },
    servers: [
      {
        url: process.env.BACKEND_URL || "http://localhost:3000",
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
            id: { type: "string", description: "Unique identifier (MongoDB ObjectId)" },
            fullName: { type: "string", description: "Full name of the user" },
            email: { type: "string", format: "email", description: "User email address" },
            password: { type: "string", description: "User password (hashed)" },
            role: { type: "string", description: "Role of the user (e.g., admin, student)" },
            emailVerified: { type: "boolean", description: "Indicates if the user's email is verified" },
            active: { type: "boolean", description: "Indicates if the user account is active" },
            access: { type: "string", description: "Access level of the user" },
          },
        },
        course: {
          type: "object",
          required: ["courseTitle", "courseCode", "semester", "level"],
          properties: {
            id: { type: "string", description: "Unique identifier (MongoDB ObjectId)" },
            courseTitle: { type: "string", description: "Title of the course" },
            courseCode: { type: "string", description: "Code of the course" },
            semester: { type: "string", description: "Semester the course is offered" },
            level: { type: "string", description: "Academic level for the course" },
          },
        },
        student: {
          type: "object",
          required: ["name", "regNo", "level", "course", "fingerPrint", "admissionYear"],
          properties: {
            id: { type: "string", description: "Unique identifier (MongoDB ObjectId)" },
            name: { type: "string", description: "Full name of the student" },
            regNo: { type: "string", description: "Registration number of the student" },
            level: { type: "string", description: "Academic level of the student" },
            course: {
              type: "array",
              items: { type: "string", description: "Course ID (MongoDB ObjectId)" },
              description: "Courses the student is enrolled in",
            },
            fingerPrint: { type: "string", description: "Fingerprint data of the student" },
            admissionYear: { type: "string", description: "Year of admission" },
          },
        },
        session: {
          type: "object",
          required: ["name", "start", "end", "semesters", "attendance"],
          properties: {
            id: { type: "string", description: "Unique identifier (MongoDB ObjectId)" },
            name: { type: "string", description: "Name of the session" },
            start: { type: "string", format: "date-time", description: "Start date of the session" },
            end: { type: "string", format: "date-time", description: "End date of the session" },
            semesters: {
              type: "array",
              items: { type: "string" },
              description: "Semesters included in the session",
            },
            attendance: {
              type: "array",
              items: { type: "string", description: "Attendance record ID (MongoDB ObjectId)" },
              description: "Attendance records for the session",
            },
          },
        },
        attendance: {
          type: "object",
          required: ["course", "academicSession", "semester", "students", "active", "level"],
          properties: {
            id: { type: "string", description: "Unique identifier (MongoDB ObjectId)" },
            course: { type: "string", description: "Course ID (MongoDB ObjectId)" },
            academicSession: { type: "string", description: "Academic session ID (MongoDB ObjectId)" },
            semester: { type: "string", description: "Semester for the attendance record" },
            students: {
              type: "array",
              items: { $ref: "#/components/schemas/student" },
              description: "Students associated with the attendance record",
            },
            active: { type: "boolean", description: "Indicates if attendance is active" },
            level: { type: "string", description: "Level of students in the attendance record" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/routes/*.js"], // Ensures compatibility with TypeScript and JavaScript
};

// module.exports = swaggerOptions;


// const swaggerOptions = {
//   swaggerDefinition: {
//     openapi: "3.0.0",
//     info: {
//       title: "Academic Management System API",
//       version: "1.0.0",
//       description: "API for managing users, courses, attendance, and sessions.",
//     },
//     servers: [
//       {
//         url: process.env.backendUrl || "http://localhost:3000",
//       },
//     ],
//     components: {
//       schemas: {
//         user: {
//           type: "object",
//           required: [
//             "fullName",
//             "email",
//             "password",
//             "role",
//             "emailVerified",
//             "active",
//           ],
//           properties: {
//             fullName: { type: "string", description: "Full name of the user" },
//             email: { type: "string", format: "email", description: "User email address" },
//             password: { type: "string", format: "password", description: "User password" },
//             role: { type: "string", description: "Role of the user (e.g., admin, student)" },
//             id: { type: "string", format: "objectId", description: "Unique identifier for the user" },
//             emailVerified: { type: "boolean", description: "Indicates if the user email is verified" },
//             active: { type: "boolean", description: "Indicates if the user account is active" },
//             access: { type: "string", description: "Access level of the user" },
//           },
//         },
//         course: {
//           type: "object",
//           required: ["courseTitle", "courseCode", "semester", "level"],
//           properties: {
//             courseTitle: { type: "string", description: "Title of the course" },
//             courseCode: { type: "string", description: "Code of the course" },
//             semester: { type: "string", description: "Semester the course is offered" },
//             level: { type: "string", description: "Academic level for the course" },
//           },
//         },
//         student: {
//           type: "object",
//           required: ["name", "regNo", "level", "course", "fingerPrint", "addmissionYear"],
//           properties: {
//             name: { type: "string", description: "Full name of the student" },
//             regNo: { type: "string", description: "Registration number of the student" },
//             level: { type: "string", description: "Academic level of the student" },
//             course: {
//               type: "array",
//               items: { type: "string", format: "objectId" },
//               description: "Courses the student is enrolled in",
//             },
//             fingerPrint: { type: "string", description: "Fingerprint data of the student" },
//             addmissionYear: { type: "string", description: "Year of admission" },
//           },
//         },
//         session: {
//           type: "object",
//           required: ["name", "start", "end", "semesters", "attendance"],
//           properties: {
//             name: { type: "string", description: "Name of the session" },
//             start: { type: "string", format: "date", description: "Start date of the session" },
//             end: { type: "string", format: "date", description: "End date of the session" },
//             semesters: {
//               type: "array",
//               items: { type: "string" },
//               description: "Semesters included in the session",
//             },
//             attendance: {
//               type: "array",
//               items: { type: "string", format: "objectId" },
//               description: "Attendance records for the session",
//             },
//           },
//         },
//         attendance: {
//           type: "object",
//           required: ["course", "acedemicSession", "semester", "students", "active", "level"],
//           properties: {
//             course: { type: "string", format: "objectId", description: "Course associated with attendance" },
//             acedemicSession: { type: "string", format: "objectId", description: "Academic session of attendance" },
//             semester: { type: "string", description: "Semester for the attendance record" },
//             students: {
//               type: "array",
//               items: { $ref: "#/components/schemas/student" },
//               description: "Students associated with the attendance record",
//             },
//             active: { type: "boolean", description: "Indicates if attendance is active" },
//             level: { type: "string", description: "Level of students in the attendance record" },
//           },
//         },
//       },
//     },
//   },
//   apis: ["./src/routes/*.ts"], // Path to your route files
// };

 const swaggerDocs = swaggerJsDoc(swaggerOptions);
// app.use(
//   "/api-docs",
//   express.static("node_modules/swagger-ui-dist/", { index: false }),
//   swaggerUi.serve,
//   swaggerUi.setup(swaggerDocs)
// );
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
  })
);
// Serve the Swagger UI static assets (CSS, JS, etc.)
app.use(
  "/api-docs",
  express.static(path.join(__dirname, "node_modules/swagger-ui-dist"))
);
app.use(
  "/api-docs/swagger-ui.css",
  express.static(
    path.join(__dirname, "node_modules/swagger-ui-dist/swagger-ui.css")
  )
);
app.use(
  "/api-docs/swagger-ui-bundle.js",
  express.static(
    path.join(__dirname, "node_modules/swagger-ui-dist/swagger-ui-bundle.js")
  )
);
app.use(
  "/api-docs/swagger-ui-standalone-preset.js",
  express.static(
    path.join(
      __dirname,
      "node_modules/swagger-ui-dist/swagger-ui-standalone-preset.js"
    )
  )
);
app.use(
  "/api-docs/swagger-ui-init.js",
  express.static(
    path.join(__dirname, "node_modules/swagger-ui-dist/swagger-ui-init.js")
  )
);

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("hello from this middleware");
  next();
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/acedemicSession", acedemicRoute);
app.use("/api/v1/attendance", attendanceRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/student", studentRoute);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  throw new Error("This route does not exist");
});

app.use(globalErrorHandler);

export default app;
