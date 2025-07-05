import mongoose, { model, models, Schema } from "mongoose";
import { Report } from "./Report";
/**
 * Topic schema model.
 * Represents information of a registered topic.
 *
 * Fields:
 * - vietnameseName: Topic name in Vietnamese.
 * - englishName: Topic name in English.
 * - type: Type of topic.
 * - summary: Short paragraph summarizes topic.
 * - reference: Source and references of topic.
 * - expectedResult: Goals achieved after finish researching.
 * - participants: Other students participate in this project.
 * - registrationPeriod: Which timeline was the topic registered in.
 * - reviewAssignments: List of assigned reviewers to topic.
 * - appraiseAssignments: List of assigned appraisal boards to topic.
 * - owner: Owner of this project topic.
 * - instructor: Instructor who guides and monitors the project.
 * - files: Files related to project.
 * - reviewPassed: Indicates whether the topic review has passed.
 */
const topicSchema = new Schema(
  {
    vietnameseName: { type: String, required: true },
    englishName: { type: String, required: true },
    type: { type: String },
    summary: { type: String, required: true },
    reference: { type: [String], required: true },
    expectedResult: { type: String, required: true },
    participants: { type: [String], required: true },
    registrationPeriod: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "RegistrationPeriod",
      required: true,
    },
    reviewPassed: {
      type: Boolean,
      default: false,
    },
    reviewAssignments: [
      {
        instructor: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "Instructor",
          required: true,
        },
        reviewGrade: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "ReviewGrade",
          default: null,
        },
        assignedAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["pending", "completed", "removed"],
          default: "pending",
        },
      },
    ],
    appraisePassed: {
      type: Boolean,
      default: false,
    },
    appraiseAssignments: [
      {
        appraisalBoard: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "AppraisalBoard",
          required: true,
        },
        appraiseGrade: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "AppraiseGrade",
          default: null,
        },
        assignedAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["pending", "completed", "removed"],
          default: "pending",
        },
      },
    ],
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Student",
      required: true,
    },
    instructor: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Instructor",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

topicSchema.index({ owner: 1 });
topicSchema.index({ instructor: 1 });
topicSchema.index({ registrationPeriod: 1 });
topicSchema.index({ "reviewAssignments.instructor": 1 });
topicSchema.index({ "appraiseAssignments.appraisalBoard": 1 });

topicSchema.set("toJSON", { virtuals: true });

topicSchema.virtual("files", {
  ref: "TopicFile",
  localField: "_id",
  foreignField: "topicId",
});

topicSchema.virtual("report", {
  ref: "Report",
  localField: "_id",
  foreignField: "topicId",
});

topicSchema.pre("save", async function (next) {
  if (this.isModified("reviewAssignments")) {
    try {
      const ReviewGrade = mongoose.model("ReviewGrade");

      for (const assignment of this.reviewAssignments) {
        if (!assignment.reviewGrade && assignment.status === "pending") {
          const newReviewGrade = await ReviewGrade.create({
            topicId: this._id,
            instructorId: assignment.instructor,
            status: "pending",
          });
          assignment.reviewGrade = newReviewGrade._id;
        }
      }
    } catch (error) {
      next(error);
    }
  }

  if (this.isModified("appraiseAssignments")) {
    try {
      const AppraiseGrade = mongoose.model("AppraiseGrade");

      for (const assignment of this.appraiseAssignments) {
        if (!assignment.appraiseGrade && assignment.status === "pending") {
          const newAppraiseGrade = await AppraiseGrade.create({
            topicId: this._id,
            appraisalBoardId: assignment.appraisalBoard,
            status: "pending",
          });
          assignment.appraiseGrade = newAppraiseGrade._id;
        }
      }
    } catch (error) {
      next(error);
    }
  }

  if (this.isModified("reviewPassed")) {
    try {
      const Report = mongoose.model("Report");

      const existingReport = await Report.findOne({ topicId: this._id });

      if (this.reviewPassed === true) {
        if (!existingReport) {
          await Report.create({
            studentId: this.owner,
            instructorId: this.instructor,
            topicId: this._id,
            sections: [],
            submittedDate: new Date(),
          });
        }
      } else {
        if (existingReport) {
          await Report.findByIdAndDelete(existingReport._id);
        }
      }
    } catch (error) {
      next(error);
    }
  }

  next();
});

topicSchema.methods.updateReviewers = async function (newReviewerIds) {
  try {
    const currentAssignments = this.reviewAssignments || [];
    const ReviewGrade = mongoose.model("ReviewGrade");

    for (const assignment of currentAssignments) {
      if (!newReviewerIds.includes(assignment.instructor.toString())) {
        assignment.status = "removed";
      }
    }

    for (const reviewerId of newReviewerIds) {
      const existingAssignment = currentAssignments.find(
        (a) => a.instructor.toString() === reviewerId
      );

      if (existingAssignment) {
        if (existingAssignment.status === "removed") {
          existingAssignment.status = "pending";

          let needsNewGrade = !existingAssignment.reviewGrade;
          if (existingAssignment.reviewGrade) {
            const existingGrade = await ReviewGrade.findById(
              existingAssignment.reviewGrade
            );
            needsNewGrade =
              !existingGrade || existingGrade.status === "cancelled";
          }

          if (needsNewGrade) {
            const newGrade = await ReviewGrade.create({
              topicId: this._id,
              instructorId: reviewerId,
              status: "pending",
            });
            existingAssignment.reviewGrade = newGrade._id;
          }
        }
      } else {
        const newGrade = await ReviewGrade.create({
          topicId: this._id,
          instructorId: reviewerId,
          status: "pending",
        });

        this.reviewAssignments.push({
          instructor: reviewerId,
          reviewGrade: newGrade._id,
          assignedAt: new Date(),
          status: "pending",
        });
      }
    }

    const removedAssignments = currentAssignments.filter(
      (a) => a.status === "removed"
    );
    for (const assignment of removedAssignments) {
      if (assignment.reviewGrade) {
        await ReviewGrade.findByIdAndUpdate(assignment.reviewGrade, {
          status: "cancelled",
        });
      }
    }

    await this.save();

    await this.updateReviewPassedStatus();
  } catch (error) {
    throw new Error(`Failed to update reviewers: ${error.message}`);
  }
};

topicSchema.methods.updateAppraisers = async function (newAppraiserIds) {
  try {
    const currentAssignments = this.appraiseAssignments || [];
    const AppraiseGrade = mongoose.model("AppraiseGrade");

    for (const assignment of currentAssignments) {
      if (!newAppraiserIds.includes(assignment.appraisalBoard.toString())) {
        assignment.status = "removed";
      }
    }

    for (const appraiserId of newAppraiserIds) {
      const existingAssignment = currentAssignments.find(
        (a) => a.appraisalBoard.toString() === appraiserId
      );

      if (existingAssignment) {
        if (existingAssignment.status === "removed") {
          existingAssignment.status = "pending";

          let needsNewGrade = !existingAssignment.appraiseGrade;
          if (existingAssignment.appraiseGrade) {
            const existingGrade = await AppraiseGrade.findById(
              existingAssignment.appraiseGrade
            );
            needsNewGrade =
              !existingGrade || existingGrade.status === "cancelled";
          }

          if (needsNewGrade) {
            const newGrade = await AppraiseGrade.create({
              topicId: this._id,
              appraisalBoardId: appraiserId,
              status: "pending",
            });
            existingAssignment.appraiseGrade = newGrade._id;
          }
        }
      } else {
        const newGrade = await AppraiseGrade.create({
          topicId: this._id,
          appraisalBoardId: appraiserId,
          status: "pending",
        });

        this.appraiseAssignments.push({
          appraisalBoard: appraiserId,
          appraiseGrade: newGrade._id,
          assignedAt: new Date(),
          status: "pending",
        });
      }
    }

    const removedAssignments = currentAssignments.filter(
      (a) => a.status === "removed"
    );
    for (const assignment of removedAssignments) {
      if (assignment.appraiseGrade) {
        await AppraiseGrade.findByIdAndUpdate(assignment.appraiseGrade, {
          status: "cancelled",
        });
      }
    }

    await this.save();

    await this.updateAppraisePassedStatus();
  } catch (error) {
    throw new Error(`Failed to update appraisers: ${error.message}`);
  }
};

topicSchema.methods.updateReviewPassedStatus = async function () {
  try {
    await this.populate("reviewAssignments.reviewGrade");

    const activeAssignments = this.reviewAssignments.filter(
      (assignment) => assignment.status !== "removed"
    );

    if (activeAssignments.length === 0) {
      this.reviewPassed = false;
      await this.save();
      return;
    }

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
        this.reviewPassed = averageGrade >= 70;
      } else {
        this.reviewPassed = false;
      }
    } else {
      this.reviewPassed = false;
    }

    await this.save();
  } catch (error) {
    console.error("Error updating review passed status:", error);
    throw new Error(`Failed to update review passed status: ${error.message}`);
  }
};

topicSchema.methods.updateAppraisePassedStatus = async function () {
  try {
    await this.populate("appraiseAssignments.appraiseGrade");

    const activeAssignments = this.appraiseAssignments.filter(
      (assignment) => assignment.status !== "removed"
    );

    if (activeAssignments.length === 0) {
      this.appraisePassed = false;
      await this.save();
      return;
    }

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
        this.appraisePassed = averageGrade >= 70;
      } else {
        this.appraisePassed = false;
      }
    } else {
      this.appraisePassed = false;
    }

    await this.save();
  } catch (error) {
    console.error("Error updating appraise passed status:", error);
    throw new Error(
      `Failed to update appraise passed status: ${error.message}`
    );
  }
};

export const Topic = models?.Topic || model("Topic", topicSchema);
