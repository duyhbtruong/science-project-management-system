import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const OPTIONS = {
  dbName: "project-01-uit",
  bufferCommands: true,
};

export function mongooseConnect() {
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log("Already connected.");
    return mongoose.connection.asPromise();
  } else {
    return mongoose.connect(MONGODB_URI);
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
