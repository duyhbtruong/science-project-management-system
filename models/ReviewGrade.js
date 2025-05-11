import mongoose, { model, models, Schema } from "mongoose";
import { criteriaSchema } from "./Criteria";

/**
 * Review grade model schema.
 * Represents an review record of a topic by a review instructor.
 *
 * Fields:
 * - topicId: Unique Id of a topic.
 * - instructorId: Unique Id of an appraisal board who grades this.
 * - status: Current state of this review record.
 * - criteria: List of criterias.
 * - finalGrade: Final grade to see if the topic passed or not.
 * - isEureka: If the topic is good enough to participate in Eureka.
 * - comment: Leave comments for student.
 * - submittedDate: The date that the review instructor submit.
 */
const reviewGradeSchema = new Schema(
  {
    topicId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Topic",
      required: true,
    },
    instructorId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Instructor",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    criteria: {
      type: [
        {
          title: String,
          grade: Number,
        },
      ],
      required: true,
      default: [],
    },
    finalGrade: {
      type: Number,
      default: null,
    },
    isEureka: {
      type: Boolean,
      required: true,
      default: false,
    },
    comment: String,
    submittedDate: Date,
  },
  {
    timestamps: true,
  }
);

export const ReviewGrade =
  models?.ReviewGrade || model("ReviewGrade", reviewGradeSchema);
