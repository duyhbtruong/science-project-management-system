import { model, models, Schema } from "mongoose";

// Model cho Đợt đăng ký Đề tài
const registrationPeriodSchema = new Schema({
  title: { type: String, required: true }, // Tên đợt đăng ký
  startDate: { type: Date, required: true }, // Ngày bắt đầu
  endDate: { type: Date, required: true }, // Ngày kết thúc
  reviewDeadline: { type: Date, required: true }, // Hạn kiểm duyệt
  submitDeadline: { type: Date, required: true }, // Hạn nộp file nghiệm thu
  appraiseDeadline: { type: Date, required: true }, // Hạn thẩm định
  isArchived: { type: Boolean, default: false }, // Trạng thái của đợt đăng ký: Đang mở | Đã được lưu trữ
});

export const RegistrationPeriod =
  models?.RegistrationPeriod ||
  model("RegistrationPeriod", registrationPeriodSchema);
