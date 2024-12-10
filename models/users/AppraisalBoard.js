import mongoose, { model, models, Schema } from "mongoose";

// Model cho Cán bộ Hội đồng Thẩm định
export const appraisalBoardSchema = new Schema({
  appraisalBoardId: { type: String, required: true, unique: true }, // Mã số của Cán bộ
  accountId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Account",
    required: true,
  }, // ID Tài khoản
});

export const AppraisalBoard =
  models?.AppraisalBoard || model("AppraisalBoard", appraisalBoardSchema);
