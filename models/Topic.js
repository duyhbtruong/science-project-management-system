import { model, models, Schema } from "mongoose";
import { studentSchema } from "@/models/Student";
import { instructorSchema } from "@/models/Instructor";

const TopicSchema = new Schema(
  {
    vietnameseName: { type: String, required: true },
    englishName: { type: String, required: true },
    type: { type: String },
    summary: { type: String, required: true },
    reference: { type: String, required: true },
    expectedResult: { type: String, required: true },
    participants: { type: [String], required: true },
    owner: studentSchema,
    instructor: instructorSchema,
  },
  {
    timestamps: true,
  }
);

export const Topic = models?.Topic || model("Topic", TopicSchema);
