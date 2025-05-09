import mongoose, { model, models, Schema } from "mongoose";
import { sectionSchema } from "./Section";

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
 * - sections: Content of report.
 * - owner: Owner of this project topic.
 * - instructor: Instructor who guides and monitors the project.
 * - files: Files related to project.
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
    sections: { type: [sectionSchema], default: [] },
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

topicSchema.set("toJSON", { virtuals: true });

topicSchema.virtual("files", {
  ref: "TopicFile",
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

  next();
});

topicSchema.methods.updateReviewers = async function (newReviewerIds) {
  const currentAssignments = this.reviewAssignments || [];
  const ReviewGrade = mongoose.model("ReviewGrade");

  // Mark removed assignments
  for (const assignment of currentAssignments) {
    if (!newReviewerIds.includes(assignment.instructor.toString())) {
      assignment.status = "removed";
    }
  }

  // Add new assignments
  for (const reviewerId of newReviewerIds) {
    const existingAssignment = currentAssignments.find(
      (a) => a.instructor.toString() === reviewerId
    );

    if (existingAssignment) {
      if (existingAssignment.status === "removed") {
        existingAssignment.status = "pending";
        if (!existingAssignment.reviewGrade) {
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

  // Cancel grades for removed assignments
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
};

topicSchema.methods.updateAppraisers = async function (newAppraiserIds) {
  const currentAssignments = this.appraiseAssignments || [];
  const AppraiseGrade = mongoose.model("AppraiseGrade");

  // Mark removed assignments
  for (const assignment of currentAssignments) {
    if (!newAppraiserIds.includes(assignment.appraisalBoard.toString())) {
      assignment.status = "removed";
    }
  }

  // Add new assignments
  for (const appraiserId of newAppraiserIds) {
    const existingAssignment = currentAssignments.find(
      (a) => a.appraisalBoard.toString() === appraiserId
    );

    if (existingAssignment) {
      if (existingAssignment.status === "removed") {
        existingAssignment.status = "pending";
        // Create new grade if needed
        if (!existingAssignment.appraiseGrade) {
          const newGrade = await AppraiseGrade.create({
            topicId: this._id,
            appraisalBoardId: appraiserId,
            status: "pending",
          });
          existingAssignment.appraiseGrade = newGrade._id;
        }
      }
    } else {
      // Create new assignment
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

  // Cancel grades for removed assignments
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
};

export const Topic = models?.Topic || model("Topic", topicSchema);
