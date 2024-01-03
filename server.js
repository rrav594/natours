const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DB.replace("<password>", process.env.DB_PASSWORD);

mongoose.connect(DB).then(() => {
  // console.log(con.connections);
  console.log("DB connection successful");
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
