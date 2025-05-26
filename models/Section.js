import { Schema, models, model } from "mongoose";

/**
 * SectionTemplate model schema.
 * Represents template for report sections that can be used across multiple reports.
 * Can be created and edited by technology science department employee.
 *
 * Fields:
 * - title: Title of the section template.
 * - order: Order of this section template in a list.
 */
export const sectionTemplateSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    order: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

/**
 * Section model schema.
 * Represents actual sections in reports, based on templates.
 * Contains the content filled in by students.
 *
 * Fields:
 * - templateId: Reference to SectionTemplate
 * - reportId: Reference to Report
 * - content: Content filled in by student
 * - embedding: Vector embedding for similarity search
 */
export const sectionSchema = new Schema(
  {
    templateId: {
      type: Schema.Types.ObjectId,
      ref: "SectionTemplate",
      required: true,
    },
    reportId: { type: Schema.Types.ObjectId, ref: "Report", required: true },
    content: { type: String, default: "" },
    embedding: { type: [Number], default: null },
  },
  {
    timestamps: true,
  }
);

export const SectionTemplate =
  models?.SectionTemplate || model("SectionTemplate", sectionTemplateSchema);
export const Section = models?.Section || model("Section", sectionSchema);
