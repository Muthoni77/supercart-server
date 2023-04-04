import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("Successfully connected to MONGO_DB");
    }
  } catch (error) {
    console.log("Failed to connect to DB");
    console.log(error);
  }
};

export default connectToDB;
