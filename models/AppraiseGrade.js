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
 * - criteria: List of criterias with their grades.
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
  { timestamps: true }
);

appraiseGradeSchema.post("save", async function () {
  try {
    const Topic = mongoose.model("Topic");
    const topic = await Topic.findById(this.topicId).populate(
      "appraiseAssignments.appraiseGrade"
    );

    if (!topic) return;

    const activeAssignments = topic.appraiseAssignments.filter(
      (assignment) => assignment.status !== "removed"
    );

    const allGraded = activeAssignments.every(
      (assignment) =>
        assignment.appraiseGrade &&
        assignment.appraiseGrade.status === "completed"
    );

    if (allGraded) {
      const validGrades = activeAssignments
        .map((assignment) => assignment.appraiseGrade.finalGrade)
        .filter((grade) => grade !== null);

      if (validGrades.length > 0) {
        const averageGrade =
          validGrades.reduce((sum, grade) => sum + grade, 0) /
          validGrades.length;
        topic.appraisePassed = averageGrade >= 70;
        await topic.save();
      }
    }
  } catch (error) {
    console.error("Error updating topic appraise status:", error);
  }
});

export const AppraiseGrade =
  models?.AppraiseGrade || model("AppraiseGrade", appraiseGradeSchema);
