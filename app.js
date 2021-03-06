var express = require("express");
const mongoose = require("mongoose");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const blogRouter = require("./routes/blog");
const profileRouter = require("./routes/profile");

const dotenv = require("dotenv");
dotenv.config();

const { setCors } = require("./middleware/security");

var app = express();

//USING LOWDB
/* const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("data/db.json");
const db = low(adapter);
db.defaults({
  posts: [],
}).write(); */

//USING MONGODB
mongoose.connect(
  `mongodb+srv://dbMariana:test1234@cluster0.u2n6q.mongodb.net/blogDatabase?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.on("error", console.error);
mongoose.connection.on("open", () =>
  console.log("Database connection established")
);

app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(setCors);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/blog", blogRouter);
app.use("/profile", profileRouter);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({
    error: {
      message: err.message,
    },
  });
});

module.exports = app;
