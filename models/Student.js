import mongoose, { model, models, Schema } from "mongoose";

export const studentSchema = new Schema({
  studentId: { type: String, required: true, unique: true },
  faculty: { type: String, required: true },
  educationProgram: { type: String, required: true },
  isRegistered: { type: Boolean, default: false, required: true },
  accountId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Account",
    required: true,
  },
});

export const Student = models?.Student || model("Student", studentSchema);
