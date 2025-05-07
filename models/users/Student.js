import mongoose, { model, models, Schema } from "mongoose";

/**
 * Student model schema.
 * Represents an user with student role in the application.
 *
 * Fields:
 * - studentId: Unique Id of a student.
 * - faculty: The faculty which the student belongs to.
 * - educationProgram: The education program the student currently participates in.
 * - accountId: Unqiue Id from accounts collection.
 */
export const studentSchema = new Schema({
  studentId: { type: String, required: true, unique: true },
  faculty: { type: String, required: true },
  educationProgram: { type: String, required: true },
  accountId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Account",
    required: true,
  },
});

export const Student = models?.Student || model("Student", studentSchema);
