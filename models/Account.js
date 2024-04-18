import { model, models, Schema } from "mongoose";

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
