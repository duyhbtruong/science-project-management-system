import mongoose, { model, models, Schema } from "mongoose";

const instructorSchema = new Schema({
  instructorId: { type: String, required: true, unique: true },
  faculty: { type: String, required: true },
  accountId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Account",
    required: true,
  },
});

export const Instructor =
  models?.Instructor || model("Instructor", instructorSchema);
