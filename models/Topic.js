import mongoose, { model, models, Schema } from "mongoose";

const intructorSchema = new Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  academicRank: { type: String, required: true },
});

// Model cho Class Topic
const topicSchema = new Schema(
  {
    vietnameseName: { type: String, required: true }, // Tên tiếng Việt
    englishName: { type: String, required: true }, // Tên tiếng Anh
    type: { type: String }, // Loại đề tài - Nghiên cứu cơ bản
    summary: { type: String, required: true }, // Tóm tắt đề tài
    reference: { type: [String], required: true }, // Tham khảo đề tài
    expectedResult: { type: String, required: true }, // Kết quả dự đoán
    participants: { type: [String], required: true }, // Danh sách thành viên
    isReviewed: { type: Boolean, default: false, required: true }, // Trạng thái đánh giá đề tài: Chưa đánh giá | Đã đánh giá
    reviews: { type: [mongoose.SchemaTypes.ObjectId] }, // Danh sách kết quả kiểm duyệt
    isAppraised: { type: Boolean, default: false, required: true }, // Trạng thái kiểm duyệt: Chưa kiểm duyệt | Đã kiểm duyệt
    appraises: { type: [mongoose.SchemaTypes.ObjectId] }, // Danh sách kết quả nghiệm thu
    fileRef: { type: String, default: null }, // fileRef
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Student",
      required: true,
    }, // Chủ sở hữu đề tài
    instructor: intructorSchema, // GVHD
  },
  {
    timestamps: true, // Thời gian đăng ký đề tài
  }
);

export const Topic = models?.Topic || model("Topic", topicSchema);
