import { model, models, Schema } from "mongoose";

const TopicSchema = new Schema(
  {
    vietnameseName: { type: String, required: true },
    englishName: { type: String, required: true },
    type: { type: String },
    summary: { type: String, required: true },
    reference: { type: [String], required: true },
    expectedResult: { type: String, required: true },
    participants: { type: [String], required: true },
    isReviewed: { type: Boolean, default: false, required: true },
    isAppraised: { type: Boolean, default: false, required: true },
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Student",
      required: true,
    },
    instructor: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Instructor",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Topic = models?.Topic || model("Topic", TopicSchema);
