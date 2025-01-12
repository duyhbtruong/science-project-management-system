import mongoose, { model, models, Schema } from "mongoose";

// Model cho Class Review Grade
const reviewGradeSchema = new Schema(
  {
    topicId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Topic",
      required: true,
    }, // Mã đề tài
    instructorId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Instructor",
      required: true,
    }, // Mã giảng viên kiểm duyệt
    criteria: {
      type: [Number],
      required: true,
    }, // Điểm tiêu chí
    grade: {
      type: Number,
      required: true,
    }, // Điểm tổng
    isEureka: {
      type: String,
      required: true,
    }, // Đạt Eureka hay không
    note: {
      type: String,
      required: true,
    }, // Ghi chú
  },
  {
    timestamps: true,
  }
);

export const ReviewGrade =
  models?.ReviewGrade || model("ReviewGrade", reviewGradeSchema);
