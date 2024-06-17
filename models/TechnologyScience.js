import mongoose, { model, models, Schema } from "mongoose";

// Model cho Technology Science
export const technologyScienceSchema = new Schema({
  // Mã số của phòng Khoa học Công nghệ
  technologyScienceId: { type: String, required: true, unique: true },
  // ID liên kết với tài khoản sinh viên
  accountId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Account",
    required: true,
  },
});

export const TechnologyScience =
  models?.TechnologyScience ||
  model("TechnologyScience", technologyScienceSchema);
