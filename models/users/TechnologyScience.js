import mongoose, { model, models, Schema } from "mongoose";

/**
 * Technology science model schema.
 * Represents an user with technology science in the application.
 *
 * Fields:
 * - technologyScienceId: Unique Id of a technology science department employee.
 * - accountId: Unqiue Id from accounts collection.
 */
const technologyScienceSchema = new Schema({
  technologyScienceId: { type: String, required: true, unique: true },
  accountId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Account",
    required: true,
  },
});

export const TechnologyScience =
  models?.TechnologyScience ||
  model("TechnologyScience", technologyScienceSchema);
