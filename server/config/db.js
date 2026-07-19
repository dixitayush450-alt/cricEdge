const mongoose = require("mongoose");
const User = require("../models/User");

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI
    );

    await User.updateMany(
      {
        googleId: null,
      },
      {
        $unset: {
          googleId: "",
        },
      }
    );

    await User.updateMany(
      {
        githubId: null,
      },
      {
        $unset: {
          githubId: "",
        },
      }
    );

    await User.syncIndexes();

    console.log(
      "✅ MongoDB Connected Successfully"
    );
  } catch (error) {
    console.error(
      "❌ MongoDB Connection Failed"
    );

    console.error(error.message);

    process.exit(1);
  }
};

module.exports = connectDB;