import { Schema, models, model } from "mongoose";

export const SectionSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    order: { type: Number, required: true, default: 0 },
    content: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

export const Section = models?.Section || model("Section", SectionSchema);
