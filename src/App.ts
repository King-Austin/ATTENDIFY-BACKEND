import express, { Response, Request, NextFunction } from "express";
import globalErrorHandler from "./errors/errorController";
import authRoute from "./routes/authRoute";
import acedemicRoute from "./routes/acedemicSessionRoute";
import attendanceRoute from "./routes/attendanceRoute";
import courseRoute from "./routes/courseRoute";
import studentRoute from "./routes/studentsRoute";
import lecturerRoute from "./routes/lecturerRoute";
import activitiesrRoute from "./routes/activitiesRoute";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import { setupSwaggerDocs } from "./swagger";

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


// Setup Swagger docs
setupSwaggerDocs(app);


app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("hello from this middleware");
  next();
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/acedemicSession", acedemicRoute);
app.use("/api/v1/attendance", attendanceRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/student", studentRoute);
app.use("/api/v1/lecturer", lecturerRoute);
app.use("/api/v1/activities", activitiesrRoute);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  throw new Error("This route does not exist");
});

app.use(globalErrorHandler);

export default app;
