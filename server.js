const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });
const app = require("./app");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  // process.exit(1);
});

const DB = process.env.DB.replace("<password>", process.env.DB_PASSWORD);

mongoose.connect(DB).then(() => {
  // console.log(con.connections);
  console.log("DB connection successful");
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on("unhandled rejections", (err) => {
  console.log("Unhandled Rejection! Shutting Down.....");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
