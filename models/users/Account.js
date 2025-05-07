import { model, models, Schema } from "mongoose";

/**
 * Account model schema.
 * Represents an account of an user in the application.
 *
 * Fields:
 * - name: Name of user's account.
 * - email: User's email address.
 * - phone: User's phone number.
 * - password: Hashed password.
 * - role: User's role.
 * - timestamps: Timestamps of account creation.
 */
const accountSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    role: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Account = models?.Account || model("Account", accountSchema);
