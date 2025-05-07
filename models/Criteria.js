import { Schema } from "mongoose";

/**
 * Criteria model schema.
 * Represents criteria for review instructors and appraisal boards to use.
 *
 * Fields:
 * - title: Title of the criteria.
 * - grade: Grade of the criteria.
 */
export const criteriaSchema = new Schema({
  title: { type: String, required: true },
  grade: { type: Number, required: true },
});
