import mongoose from "mongoose";
import { Account } from "@/models/users/Account";
import { Student } from "@/models/users/Student";
import { Instructor } from "@/models/users/Instructor";
import { AppraisalBoard } from "@/models/users/AppraisalBoard";
import { TechnologyScience } from "@/models/users/TechnologyScience";
import { Topic } from "@/models/Topic";
import { RegistrationPeriod } from "@/models/RegistrationPeriod";
import { ReviewGrade } from "@/models/ReviewGrade";
import { AppraiseGrade } from "@/models/AppraiseGrade";
import { Criteria } from "@/models/Criteria";
import { Section, SectionTemplate } from "@/models/Section";
import { TopicFile } from "@/models/TopicFile";
import { Report } from "@/models/Report";
import { PasswordResetToken } from "@/models/users/PasswordResetToken";

const MONGODB_URI = process.env.MONGODB_URI;
const OPTIONS = {
  dbName: "science-project-management",
  bufferCommands: true,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 10000,
  maxPoolSize: 10,
  minPoolSize: 5,
  retryWrites: true,
  retryReads: true,
};

export async function mongooseConnect() {
  try {
    const connectionState = mongoose.connection.readyState;

    if (connectionState === 1) {
      return mongoose.connection.asPromise();
    } else {
      return await mongoose.connect(MONGODB_URI, OPTIONS);
    }
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}
