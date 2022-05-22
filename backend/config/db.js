const mongoose = require("mongoose");

require("dotenv").config({ path: ".env" });

const DB = async () => {
  try {
       await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
    });

    console.log("BD Conectada");
  } catch (err) {
    console.log(err);
    process.exit(0);
  }
};

module.exports = DB;
