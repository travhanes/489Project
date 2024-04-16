var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
const sequelize = require("./db");
const User = require("./models/User");
const Product = require("./models/Product")

var indexRouter = require("./routes/index");
var storeRouter = require("./routes/store");
var accountRouter = require("./routes/account")

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/*app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "wsu489",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);*/

app.use("/", indexRouter);
app.use("/store", storeRouter);
app.use("/account", accountRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

/*async function setup() {
  const subu = await User.create({ username: "subu", password: "1234" });
  console.log("subu instance created...");
  const webdev = await Course.create({
    courseid: "CPTS489",
    coursename: "Web Development",
    semester: "Spring",
    coursedesc: "Introduction to Web Development",
    enrollnum: 80,
  });
}*/

async function setup() {
  await Product.create({ productid: 0, publisherid: 0, productname: 'Blank Name', productdesc: 'Blank Description', productprice: 0 });
}

sequelize.sync({ force: true }).then(() => {
  console.log("Sequelize Sync Completed...");
  setup().then(() => console.log("Setup complete"));
  //CREATE TABLE IF NOT EXISTS Product ( productid: INTEGER PRIMARY KEY NOT NULL, publisherid: INTEGER NOT NULL, productname STRING NOT NULL, productdesc TEXT, productprice FLOAT NOT NULL );
  //INSERT INTO PRODUCT VALUES (0, 0, 'Blank', 'Blank', 0);
  //const subu = await User.create({ username: "subu", password: "1234" });
  //setup().then(() => console.log("User setup complete"));
});

module.exports = app;
