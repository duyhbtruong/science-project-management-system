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
import { Section } from "@/models/Section";
import { TopicFile } from "@/models/TopicFile";

const MONGODB_URI = process.env.MONGODB_URI;
const OPTIONS = {
  dbName: "science-project-management",
  bufferCommands: true,
};

export function mongooseConnect() {
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    return mongoose.connection.asPromise();
  } else {
    return mongoose.connect(MONGODB_URI, OPTIONS);
  }

  // if (connectionState === 2) {
  //   console.log("Connecting...");
  //   return;
  // }

  // try {
  //   mongoose.connect(MONGODB_URI);
  // } catch (err) {
  //   console.log("Error: ", err);
  //   throw new Error(err);
  // }
}
