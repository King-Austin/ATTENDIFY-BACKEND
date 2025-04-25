
---

## Attendify Backend

Attendify is a modern attendance management system that streamlines how lecturers and academic staff manage student attendance. This backend is built with Node.js, Express.js, and MongoDB, providing a RESTful API for managing users, attendance sessions, activity logs, academic sessions, and more.

## Project Background
Attendify was built to solve a real-life problem I faced as a class representative. Manually taking attendance was not only tedious but also unreliable — paper attendance could easily get lost or damaged. Lecturers often misplaced them, and the Head of Department found it difficult to track student performance from scattered records.

Being a software engineer, I decided to tackle the problem with technology by building Attendify — a centralized digital platform that allows lecturers to take, manage, and analyze attendance effortlessly, while giving admins full control and visibility across the board.
---

##  Tech Stack

- **Backend Framework:** Node.js + Express
- **Language:** TypeScript
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Email Services:** Nodemailer (for email verification and password reset)
- **Security:** Helmet, Rate Limiting, CORS

---

## 📁 Project Structure

```
src/
│
├── controllers/       # Handles business logic
├── routes/            # Route definitions
├── models/            # Mongoose schemas
├── middlewares/       # Authentication and error handlers
├── utils/             # Utility functions (email, tokens, etc.)
├── config/            # Environment configs
└── server.ts          # Entry point
```

---

##  Getting Started

### Prerequisites

- Node.js >= 16.x
- MongoDB instance (local or Atlas)
- Yarn or npm

### Installation

```bash
git clone https://github.com/your-username/university-attendance-api.git
cd university-attendance-api
npm install
```

### Configuration

Create a `.env` file at the root of the project and set the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
EMAIL_FROM=your_email@example.com
EMAIL_PASS=your_email_password
CLIENT_URL=http://localhost:3000
```

### Run the Server

#### Development

```bash
npm run dev
```

#### Production

```bash
npm run build
npm start
```

---

## Authentication Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/v1/auth/register` | Register a new user |
| POST   | `/api/v1/auth/login` | Log in an existing user |
| GET    | `/api/v1/auth/fetchMe` | Fetch current user details |
| PATCH  | `/api/v1/auth/updateMe` | Update user profile |
| PATCH  | `/api/v1/auth/changePassword` | Change user password |
| POST   | `/api/v1/auth/forgotPassword` | Request password reset |
| PATCH  | `/api/v1/auth/resetPassword/:token` | Reset password with token |
| PATCH  | `/api/v1/auth/makeUserAdmin/:id` | Grant admin access |
| PATCH  | `/api/v1/auth/verifyEmail` | Email verification |
| POST   | `/api/v1/auth/logout` | Log out |
| POST   | `/sendVerificationCode` | Send verification code |

---

##  Academic Session Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/v1/acedemicSession/createAcedemicSession` | Create academic session |
| GET    | `/api/v1/acedemicSession/fetchallAcedemicSession` | Get all sessions |
| GET    | `/api/v1/acedemicSession/fetchAcedemicSessionByID/:id` | Get session by ID |
| DELETE | `/api/v1/acedemicSession/deleteAcedemicSession/:id` | Delete a session |
| DELETE | `/api/v1/acedemicSession/deleteAllAcedemicSessions` | Delete all sessions |

---

##  Activities

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/v1/activities/fetchAllActivities` | Get all activities |

---

##  Lecturer Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/v1/lecturer/createLecturer` | Create a lecturer |
| GET    | `/api/v1/lecturer/getALecturer` | Get one lecturer |
| GET    | `/api/v1/lecturer/getAllLecturer` | Get all lecturers |
| PATCH  | `/api/v1/lecturer/updateALecturer` | Update lecturer info |
| PATCH  | `/api/v1/lecturer/deleteALecturer` | Delete a lecturer |

---

##  Student Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/v1/student/createStudent` | Add a student |
| GET    | `/api/v1/student/fetchAllTheStudents` | Get all students |
| GET    | `/api/v1/student/fetchStudentByYearOfAdmission` | By admission year |
| GET    | `/api/v1/student/fetchStudentByLevel` | By level |
| GET    | `/api/v1/student/fetchStudentByID/:id` | By ID |
| PATCH  | `/api/v1/student/updateStudentData` | Update student data |
| DELETE | `/api/v1/student/deleteAStudent/:id` | Delete student |
| DELETE | `/api/v1/student/deleteAllTheStudent` | Delete all students |

---

##  Courses

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/v1/course/addANewCourse` | Add course |
| GET    | `/api/v1/course/fetchAllCourse` | All courses |
| GET    | `/api/v1/course/fetchCoursesByLevel/:level` | By level |
| GET    | `/api/v1/course/fetchCoursesBySemester/:semester` | By semester |
| DELETE | `/api/v1/course/deleteACourse/:id` | Delete course |
| DELETE | `/api/v1/course/deleteAllCourses` | Delete all courses |

---

##  Attendance

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/v1/attendance/createAttendance` | Create attendance record |
| PATCH  | `/api/v1/attendance/activateAttendance/:attendanceId` | Activate attendance |
| PATCH  | `/api/v1/attendance/deactivateAttendance/:attendanceId` | Deactivate |
| PATCH  | `/api/v1/attendance/markAttendance/:attendanceId` | Mark attendance |
| PATCH  | `/api/v1/attendance/markAbsent/:attendanceId` | Mark as absent |
| GET    | `/api/v1/attendance/fetchAllAttendance` | All attendance records |
| GET    | `/api/v1/attendance/fetchAttendanceBySession/:sessionId` | By session |
| DELETE | `/api/v1/attendance/deleteAttendance/:attendanceId` | Delete one |
| DELETE | `/api/v1/attendance/deleteAllAttendance` | Delete all |

---

##  Features

-  Role-based access control (Admin, Lecturer, Student)
- Email verification
- Password reset flow
- Clean, modular architecture
- TypeScript safety
- RESTful endpoints
- Robust error handling

---

## Author

**Desmond Nzubechukwu**  
Software Engineer | Creating Value and Solutions  
[LinkedIn](https://www.linkedin.com/in/desmondnzubechukwu/)  

---