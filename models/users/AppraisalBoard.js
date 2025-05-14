import mongoose, { model, models, Schema } from "mongoose";

/**
 * Appraisal board model schema.
 * Represents an user with appraisal board role in the application.
 *
 * Fields:
 * - appraisalBoardId: Unique Id of a appraisal board.
 * - accountId: Unique Id from accounts collection.
 */
export const appraisalBoardSchema = new Schema({
  appraisalBoardId: { type: String, required: true, unique: true },
  accountId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Account",
    required: true,
  },
});

export const AppraisalBoard =
  models?.AppraisalBoard || model("AppraisalBoard", appraisalBoardSchema);
