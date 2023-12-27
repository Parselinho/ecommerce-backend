// const mongoose = require("mongoose");

// const connectDB = (url) => {
//   return mongoose.connect(url);
// };

// module.exports = connectDB;

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const connectDB = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("database connected");
  } catch (error) {
    console.log("database connection failed");
  }
};

module.exports = connectDB;
