const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const users = require("./routes/users");

const DB = "mongodb://127.0.0.1:27017/api_authentication";
const port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;
mongoose
  .connect(DB, {
    useMongoClient: true,
  })
  .then(() => console.log(`Successfully connected to ${DB}`))
  .catch(e => console.error(`Some bad shit happened ${e}`));

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use("/users", users);

app.listen(port, () => console.log(`listening on ${port}`));
