import { Double } from "mongodb";
import mongoose, { model, models, Schema } from "mongoose";

const appraiseGradeSchema = new Schema(
  {
    // Mã đề tài
    topicId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Topic",
      required: true,
    },
    // Mã phòng Thẩm định
    appraisalBoardId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "AppraisalBoard",
      required: true,
    },
    // Điểm từng tiêu chí
    criteria: {
      type: [Number],
      required: true,
    },
    // Điểm CHUNG
    grade: {
      type: Number,
      required: true,
    },
    // Đạt chuẩn Euraka?
    isEureka: {
      type: String,
      required: true,
    },
    // Note
    note: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const AppraiseGrade =
  models?.AppraiseGrade || model("AppraiseGrade", appraiseGradeSchema);
