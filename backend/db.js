import mongoose from "mongoose";

const MONGOURI = "mongodb://localhost:27017/metadata";
const  connectToMongo = async () => {
  try {
    await mongoose.connect(MONGOURI);
    console.log(` Connected to MongoDB`);
  } catch (err) {
    console.log(" MongoDB Connection Error:", err);
  }
};

module.exports = connectToMongo;