import mongoose, { model, models, Schema } from "mongoose";

export const appraiseSchema = new Schema({
  appraiseId: { type: String, required: true, unique: true },
  accountId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Account",
    required: true,
  },
});

export const Appraise = models?.Appraise || model("Appraise", appraiseSchema);
