import { model, models, Schema } from "mongoose";

// Model cho Class Account
const accountSchema = new Schema(
  {
    // Tên của user
    name: { type: String, required: true },
    // Email của user
    email: { type: String, required: true, unique: true },
    // Số điện thoại của user
    phone: { type: String },
    // Mật khẩu của user
    password: { type: String, required: true },
    // Quyền của user
    role: { type: String, required: true },
  },
  {
    // Thời điểm tạo account
    timestamps: true,
  }
);

export const Account = models?.Account || model("Account", accountSchema);
