"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorController_1 = __importDefault(require("./errors/errorController"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const acedemicSessionRoute_1 = __importDefault(require("./routes/acedemicSessionRoute"));
const attendanceRoute_1 = __importDefault(require("./routes/attendanceRoute"));
const courseRoute_1 = __importDefault(require("./routes/courseRoute"));
const studentsRoute_1 = __importDefault(require("./routes/studentsRoute"));
const lecturerRoute_1 = __importDefault(require("./routes/lecturerRoute"));
const activitiesRoute_1 = __importDefault(require("./routes/activitiesRoute"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const swagger_1 = require("./swagger");
(0, dotenv_1.config)({ path: "./config.env" });
const { ORIGIN_URL } = process.env;
if (!ORIGIN_URL) {
    throw new Error("Make sure that the origin url and the port is defined");
}
console.log("The origin", ORIGIN_URL);
const app = (0, express_1.default)();
// CORS configuration
const corsOptions = {
    origin: ORIGIN_URL,
    credentials: true,
    methods: "GET,POST,DELETE,PATCH",
    allowedHeaders: "Content-Type, Authorization, api_key",
};
app.use((0, cors_1.default)(corsOptions));
app.options("*", (0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("THIS API IS WORKING AS EXPECTED");
});
// Setup Swagger docs
(0, swagger_1.setupSwaggerDocs)(app);
app.use((req, res, next) => {
    console.log("hello from this middleware");
    next();
});
app.use("/api/v1/auth", authRoute_1.default);
app.use("/api/v1/acedemicSession", acedemicSessionRoute_1.default);
app.use("/api/v1/attendance", attendanceRoute_1.default);
app.use("/api/v1/course", courseRoute_1.default);
app.use("/api/v1/student", studentsRoute_1.default);
app.use("/api/v1/lecturer", lecturerRoute_1.default);
app.use("/api/v1/activities", activitiesRoute_1.default);
app.all("*", (req, res, next) => {
    throw new Error("This route does not exist");
});
app.use(errorController_1.default);
exports.default = app;
