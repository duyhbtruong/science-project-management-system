import { Schema, models, model } from "mongoose";

/**
 * Criteria model schema.
 * Represents criteria for review instructors and appraisal boards to use.
 *
 * Fields:
 * - title: Title of the criteria.
 * - minGrade: Minimum possible grade for this criteria
 * - maxGrade: Maximum possible grade for this criteria
 * - step: The increment value between grades (e.g. 5 for steps of 5)
 */
export const criteriaSchema = new Schema({
  title: { type: String, required: true },
  minGrade: { type: Number, required: true },
  maxGrade: { type: Number, required: true },
  step: { type: Number, required: true, default: 5 },
});

export const Criteria = models.Criteria || model("Criteria", criteriaSchema);
