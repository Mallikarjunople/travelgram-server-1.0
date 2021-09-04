//dependencies
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const feedbackRoute = require("./routes/feedbacks");
const userRoute = require("./routes/users");
const blogRoute = require("./routes/blogs");
const cityRoute = require("./routes/Cities");
const morgan = require("morgan");
const checkAuth = require("./middleware/check-auth");
const isAdmin = require("./middleware/isadmin");
const adminRoute = require("./routes/admin");
const tagRoute = require("./routes/tag");
require("dotenv/config");

//require the route handlers
// app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));

//connect to db
mongoose.connect(
  process.env.DB_CONNECTION,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  function () {
    console.log("connected to database");
  }
);

mongoose.Promise = global.Promise;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-with, Control-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

//routes
//app.use('/posts',postsRoute);
app.use("/users", userRoute);
app.use("/blogs", blogRoute);

app.use("/admin", checkAuth, isAdmin, adminRoute);

app.use("/City", checkAuth, cityRoute);
app.use("/tags", checkAuth, tagRoute);
app.use("/feedback", feedbackRoute);

// app.use((req, res, next) => {
//   const error = new Error("Not Found");
//   error.status = 404;

//   next(error);
// });

// app.use((error, req, res, next) => {
//   res.status(error.status || 500);
//   res.json({
//     error: {
//       message: error.message,
//     },
//   });
// });

app.get("/", function (req, res) {
  res.send("we are at home");
});

server = app.listen( process.env.PORT || 5000, function () {
  console.log("Server started successfully");
});


//baseUrl 
// module.exports.link = "https://travelgram-project.herokuapp.com/";
