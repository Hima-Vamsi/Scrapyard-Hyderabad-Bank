import mongoose from "mongoose";

const connection = mongoose.connection;

function setupDatabaseListeners() {
  connection
    .on("open", console.info.bind(console, "Database connection: open"))
    .on("close", console.info.bind(console, "Database connection: close"))
    .on(
      "disconnected",
      console.info.bind(console, "Database connection: disconnected")
    )
    .on(
      "reconnected",
      console.info.bind(console, "Database connection: reconnected")
    )
    .on(
      "fullsetup",
      console.info.bind(console, "Database connection: fullsetup")
    )
    .on("all", console.info.bind(console, "Database connection: all"))
    .on("error", console.error.bind(console, "MongoDB connection: error:"));
}

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.useDb('accounts');
  }

  try {
    setupDatabaseListeners();
    await mongoose.connect(process.env.MONGODB_URI || "");

    return mongoose.connection.useDb('accounts');
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
}

export { connectToDatabase };
