import mongoose, { model, models, Schema } from "mongoose";

// Model cho phòng Khoa học Công nghệ
const technologyScienceSchema = new Schema({
  technologyScienceId: { type: String, required: true, unique: true }, // Mã số phòng Khoa học Công nghệ
  accountId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Account",
    required: true,
  }, // ID Tài khoản
});

export const TechnologyScience =
  models?.TechnologyScience ||
  model("TechnologyScience", technologyScienceSchema);
