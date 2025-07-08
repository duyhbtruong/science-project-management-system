import { model, models, Schema } from "mongoose";

const passwordResetTokenSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

passwordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const PasswordResetToken =
  models?.PasswordResetToken ||
  model("PasswordResetToken", passwordResetTokenSchema);
