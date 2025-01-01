import mongoose, { Date, ObjectId } from "mongoose";

export interface userType {
  fullName: string;
  email: string;
  password: string;
  role: string;
  id: mongoose.ObjectId;
  confirmPassword: string | undefined;
  correctPassword(
    userPassword: string,
    originalPassword: string
  ): Promise<boolean>;
  changePasswordAfter(JWTTimestamp: string): boolean;
  createResetPasswordToken(): string;
  passwordChangeAt?: Date;
  passwordResetToken?: string;
  passwordResetTokenExpires?: Date;
  emailVerificationCode?: number | null
  emailVerificationCodeExpires?: Date | unknown | any
  emailVerified: boolean
  active: boolean
  access : string
}

export interface courseType {
  courseTitle: string
  courseCode: string
  semester: string
  level: string
}

export interface studentType{
  name: string
  regNo: number | string
  level: number | string
  course: string[] | ObjectId[]
  fingerPrint: string
  addmissionYear: string
}

export interface sessionType{
  name: string | Date | number
  start: string | Date | number
  end: string | Date | number
  semesters: string[]
  attendance: string[] | ObjectId[] | any[]
}

export interface attendanceType{
  course: string | ObjectId
  acedemicSession: ObjectId | string
  semester: string 
  students: any[] | studentType[]
  status: string | boolean
  level: string | number
}