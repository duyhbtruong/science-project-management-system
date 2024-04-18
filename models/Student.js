import mongoose, { model, models, Schema } from "mongoose";

const studentSchema = new Schema({
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
