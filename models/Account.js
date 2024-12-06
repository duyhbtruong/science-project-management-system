import { model, models, Schema } from "mongoose";

// Model cho Tài khoản
const accountSchema = new Schema(
  {
    name: { type: String, required: true }, // Tên của người dùn
    email: { type: String, required: true, unique: true }, // Email của người dùng
    phone: { type: String }, // Số điện thoại của người dùng
    password: { type: String, required: true }, // Mật khẩu của người dùng
    role: { type: String, required: true }, // Quyền của người dùn
  },
  {
    timestamps: true, // Thời điểm tạo tài khoản
  }
);

export const Account = models?.Account || model("Account", accountSchema);
