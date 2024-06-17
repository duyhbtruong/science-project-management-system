import { Double } from "mongodb";
import { model, models, Schema } from "mongoose";

// Model cho Class Review Grade
const reviewGradeSchema = new Schema(
  {
    // Mã đề tài
    topicId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Topic",
      required: true,
    },
    // Mã phòng KHCN
    technologyScienceId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "TechnologyScience",
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

export const ReviewGrade =
  models?.ReviewGrade || model("ReviewGrade", reviewGradeSchema);
