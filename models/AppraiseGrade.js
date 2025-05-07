import mongoose, { model, models, Schema } from "mongoose";
import { criteriaSchema } from "./Criteria";

/**
 * Appraise grade model schema.
 * Represents an appraise record of a topic by an appraisal board.
 *
 * Fields:
 * - topicId: Unique Id of a topic.
 * - appraisalBoardId: Unique Id of an appraisal board who grades this.
 * - status: Current state of this appraise record.
 * - criteria: List of criterias.
 * - finalGrade: Final grade to see if the topic passed or not.
 * - isEureka: If the topic is good enough to participate in Eureka.
 * - comment: Leave comments for student.
 * - submittedDate: The date that the appraisal board submit.
 */
const appraiseGradeSchema = new Schema(
  {
    topicId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Topic",
      required: true,
    },
    appraisalBoardId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "AppraisalBoard",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    criteria: {
      type: [criteriaSchema],
      required: true,
      default: [],
    },
    finalGrade: {
      type: Number,
      default: null,
    },
    isEureka: {
      type: String,
      required: true,
    },
    comment: String,
    submittedDate: Date,
  },
  { timestamps: true }
);

export const AppraiseGrade =
  models?.AppraiseGrade || model("AppraiseGrade", appraiseGradeSchema);
