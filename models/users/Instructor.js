import mongoose, { model, models, Schema } from "mongoose";

/**
 * Instructor model schema.
 * Represents an user with instructor role in the application.
 *
 * Fields:
 * - instructorId: Unique Id of an instructor.
 * - faculty: The faculty which the instructor belongs to.
 * - academicRank: The academic rank of instructor (Master, Doctor...).
 * - accountId: Unique Id from accounts collection.
 */
const instructorSchema = new Schema({
  instructorId: { type: String, required: true, unique: true },
  faculty: { type: String, required: true },
  academicRank: { type: String, required: true },
  accountId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Account",
    required: true,
  },
});

export const Instructor =
  models?.Instructor || model("Instructor", instructorSchema);
