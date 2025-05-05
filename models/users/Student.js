import mongoose, { model, models, Schema } from "mongoose";

// Model cho Sinh viên
export const studentSchema = new Schema({
  studentId: { type: String, required: true, unique: true }, // Mã số của Sinh viên
  faculty: { type: String, required: true }, // Khoa của Sinh viên
  educationProgram: { type: String, required: true }, // Chương trình đào tạo của Sinh viên
  accountId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Account",
    required: true,
  }, // ID Tài khoản
});

export const Student = models?.Student || model("Student", studentSchema);
