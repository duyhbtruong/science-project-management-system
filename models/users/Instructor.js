import mongoose, { model, models, Schema } from "mongoose";

// Model cho Giảng viên
const instructorSchema = new Schema({
  instructorId: { type: String, required: true, unique: true }, // Mã số của giảng viên
  faculty: { type: String, required: true }, // Khoa của giảng viên
  academicRank: { type: String, required: true }, // Học hàm, học vị của giảng viên
  accountId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Account",
    required: true,
  }, // ID Tài khoản
});

export const Instructor =
  models?.Instructor || model("Instructor", instructorSchema);
