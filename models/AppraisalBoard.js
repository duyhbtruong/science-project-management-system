import mongoose, { model, models, Schema } from "mongoose";

// Model cho Appraisal Board
export const appraisalBoardSchema = new Schema({
  // Mã số của phòng Thẩm định
  appraisalBoardId: { type: String, required: true, unique: true },
  // ID liên kết với tài khoản sinh viên
  accountId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Account",
    required: true,
  },
});

export const AppraisalBoard =
  models?.AppraisalBoard || model("AppraisalBoard", appraisalBoardSchema);
