import mongoose, { model, models, Schema } from "mongoose";

export const trainingSchema = new Schema({
  trainingId: { type: String, required: true, unique: true },
  accountId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Account",
    required: true,
  },
});

export const Training = models?.Training || model("Training", trainingSchema);
