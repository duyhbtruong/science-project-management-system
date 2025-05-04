import { Schema, models, model } from "mongoose";

const SectionSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    order: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const Section = models?.Section || model("Section", SectionSchema);
