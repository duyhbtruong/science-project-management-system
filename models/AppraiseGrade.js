import { Double } from "mongodb";
import { model, models, Schema } from "mongoose";

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
    // Điểm
    grade: {
      type: Double,
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
