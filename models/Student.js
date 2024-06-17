import mongoose, { model, models, Schema } from "mongoose";

// Model cho Class Student
export const studentSchema = new Schema({
  // MSSV
  studentId: { type: String, required: true, unique: true },
  // Khoa của sinh viên
  faculty: { type: String, required: true },
  // Chương trình đào tạo
  educationProgram: { type: String, required: true },
  // ID của đề tài đăng ký, nếu chưa đăng ký thì bằng null
  topicId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Topic",
    required: true,
    default: null,
  },
  // ID liên kết với tài khoản sinh viên
  accountId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Account",
    required: true,
  },
});

export const Student = models?.Student || model("Student", studentSchema);
