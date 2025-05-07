import mongoose, { Schema, model, models } from "mongoose";

/**
 * Topic file model schema.
 * Represents information of a file uploaded to application.
 *
 * Fields:
 * - topicId: Topic which this file relates to.
 * - fileType: File type.
 * - fileName: Name of uploaded file.
 * - fileUrl: URL of uploaded file.
 * - uploadedBy: The account which uploaded this file.
 */
const topicFileSchema = new Schema(
  {
    topicId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Topic",
      required: true,
    },
    fileType: {
      type: String,
      enum: ["contract", "submit", "register", "payment"],
      required: true,
    },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    uploadedBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Account",
      required: true,
    },
  },
  { timestamps: true }
);

topicFileSchema.index({ topicId: 1, fileType: 1 });

export const TopicFile =
  models?.TopicFile || model("TopicFile", topicFileSchema);
