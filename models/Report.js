import { Schema, models, model } from "mongoose";
import { sectionSchema } from "./Section";

/**
 * Report model schema.
 * Represents report sections for students to fill in.
 * Can be created and edited by technology science department employee.
 *
 * Fields:
 * - studentId: ID of student who submitted the report.
 * - instructorId: ID of instructor who instructed the report.
 * - topicId: ID of topic which student's report belongs to.
 * - sections: List of sections in report.
 * - submittedDate: Date when student submitted the report.
 */
export const reportSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    instructorId: {
      type: Schema.Types.ObjectId,
      ref: "Instructor",
      required: true,
    },
    topicId: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
    sections: { type: [sectionSchema], default: [] },
    submittedDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const Report = models?.Report || model("Report", reportSchema);
