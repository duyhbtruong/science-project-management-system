import { model, models, Schema } from "mongoose";

/**
 * Registration period model schema.
 * Represents a period in which students can register scientific projects.
 *
 * Fields:
 * - title: Title of a registration period.
 * - startDate: The date begins the registration period.
 * - endDate: The date ends the registration period.
 * - reviewDeadline: Final date for technology science department employee to review topics.
 * - submitDeadline: Final date for students to submit their reports
 * if their topic passed the review phase.
 * - appraiseDeadline: Final date for appraisal board staff to appraise
 * students' topics.
 */
const registrationPeriodSchema = new Schema({
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reviewDeadline: { type: Date, required: true },
  submitDeadline: { type: Date, required: true },
  appraiseDeadline: { type: Date, required: true },
});

export const RegistrationPeriod =
  models?.RegistrationPeriod ||
  model("RegistrationPeriod", registrationPeriodSchema);
