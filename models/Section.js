import { Schema, models, model } from "mongoose";

/**
 * Section model schema.
 * Represents report sections for students to fill in.
 * Can be created and edited by technology science department employee.
 *
 * Fields:
 * - title: Title of the section.
 * - order: Order of this section to a list.
 * - content: Content filled in by student.
 * - embedding: Vector embedding for similarity search.
 */
export const sectionSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    order: { type: Number, required: true, default: 0 },
    content: { type: String, default: "" },
    embedding: { type: [Number], default: null, select: false },
  },
  {
    timestamps: true,
  }
);

export const Section = models?.Section || model("Section", sectionSchema);
