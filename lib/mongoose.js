import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const OPTIONS = {
  dbName: "science-project-management",
  bufferCommands: true,
};

export function mongooseConnect() {
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    return mongoose.connection.asPromise();
  } else {
    return mongoose.connect(MONGODB_URI, OPTIONS);
  }

  // if (connectionState === 2) {
  //   console.log("Connecting...");
  //   return;
  // }

  // try {
  //   mongoose.connect(MONGODB_URI);
  // } catch (err) {
  //   console.log("Error: ", err);
  //   throw new Error(err);
  // }
}
