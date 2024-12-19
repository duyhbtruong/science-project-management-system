import mongoose, { model, models, Schema } from "mongoose";

// Model cho Đề tài
const topicSchema = new Schema(
  {
    vietnameseName: { type: String, required: true }, // Tên tiếng Việt
    englishName: { type: String, required: true }, // Tên tiếng Anh
    type: { type: String }, // Loại đề tài - Nghiên cứu cơ bản
    summary: { type: String, required: true }, // Tóm tắt đề tài
    reference: { type: [String], required: true }, // Tham khảo đề tài
    expectedResult: { type: String, required: true }, // Kết quả dự đoán
    participants: { type: [String], required: true }, // Danh sách thành viên

    registrationPeriod: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "RegistrationPeriod",
      required: true,
    }, // Thuộc đợt đăng ký nào

    reviewInstructor: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Instructor",
      default: null,
    }, // Giảng viên chịu trách nhiệm kiểm duyệt
    reviews: { type: [mongoose.SchemaTypes.ObjectId], ref: "ReviewGrade" }, // Danh sách kết quả kiểm duyệt

    appraiseStaff: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "AppraisalBoard",
      default: null,
    }, // Cán bộ chịu trách nhiệm thẩm định
    appraises: { type: [mongoose.SchemaTypes.ObjectId], ref: "AppraiseGrade" }, // Danh sách kết quả thẩm định

    contractFile: { type: String, default: null }, // File hợp đồng
    submitFile: { type: String, default: null }, // File nghiệm thu
    registerFile: { type: String, default: null }, // File hồ sơ lúc đăng ký
    paymentFile: { type: String, default: null }, // File quyết toán tài chính

    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Student",
      required: true,
    }, // Chủ sở hữu đề tài
    instructor: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Instructor",
      required: true,
    }, // Giảng viên hướng dẫn
  },
  {
    timestamps: true, // Thời gian đăng ký đề tài
  }
);

export const Topic = models?.Topic || model("Topic", topicSchema);
