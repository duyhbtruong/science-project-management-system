import mongoose, { model, models, Schema } from "mongoose";

// Model cho Giảng viên
const instructorSchema = new Schema({
  instructorId: { type: String, required: true, unique: true }, // Mã số giảng viên
  accountId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Account",
    required: true,
  }, // ID Tài khoản
});

export const Instructor =
  models?.Instructor || model("Instructor", instructorSchema);
