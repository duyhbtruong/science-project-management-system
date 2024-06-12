import mongoose, { model, models, Schema } from "mongoose";

export const technologyScienceSchema = new Schema({
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
