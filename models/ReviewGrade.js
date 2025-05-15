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
 * - criteria: List of criterias with their grades.
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
          criteriaId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Criteria",
            required: true,
          },
          grade: {
            type: Number,
            required: true,
          },
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

reviewGradeSchema.post("save", async function () {
  try {
    const Topic = mongoose.model("Topic");
    const topic = await Topic.findById(this.topicId).populate(
      "reviewAssignments.reviewGrade"
    );

    if (!topic) return;

    const activeAssignments = topic.reviewAssignments.filter(
      (assignment) => assignment.status !== "removed"
    );

    const allGraded = activeAssignments.every(
      (assignment) =>
        assignment.reviewGrade && assignment.reviewGrade.status === "completed"
    );

    if (allGraded) {
      const validGrades = activeAssignments
        .map((assignment) => assignment.reviewGrade.finalGrade)
        .filter((grade) => grade !== null);

      if (validGrades.length > 0) {
        const averageGrade =
          validGrades.reduce((sum, grade) => sum + grade, 0) /
          validGrades.length;
        topic.reviewPassed = averageGrade >= 70;
        await topic.save();
      }
    } else {
      topic.reviewPassed = false;
      await topic.save();
    }
  } catch (error) {
    console.error("Error updating topic review status:", error);
  }
});

export const ReviewGrade =
  models?.ReviewGrade || model("ReviewGrade", reviewGradeSchema);
