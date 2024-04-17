var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
const sequelize = require("./db");
const User = require("./models/User");
const Product = require("./models/Product")
const Publisher = require("./models/Publisher")
const ShoppingCart = require("./models/ShoppingCart")
const Wishlist = require("./models/Wishlist")
const Order = require("./models/Order")
const { v4: uuidv4 } = require('uuid');

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

async function setup() {
  for (var i = 0; i < 6; i++) {
    await Publisher.create({ publisherid: i, publishername: 'Publisher ' + i, publisherdesc: 'Description ' + i });
    await Product.create({ productid: i, publisherid: i, productname: 'Product ' + i, productimage: 'example-thumbnail.jpg', productdesc: 'Description ' + i, productprice: i });
  }

  const uid1 = uuidv4()
  const uid2 = uuidv4()

  await User.create({userid: uid1, username: "testuser", password: "123"})
  await User.create({userid: uid2, username: "testadmin", password: "123", isAdmin: true})

  const date = new Date('2024-04-16');

  await ShoppingCart.create({userid: uid1, productid: 1, quantity: 90, dateAdded: date})
  await ShoppingCart.create({userid: uid1, productid: 4, quantity: 10, dateAdded: date})
  await Order.create({orderid: 1, userid: uid1, productid: 3, status: "On the way", dateOrdered: date})
  await Wishlist.create({userid: uid1, productid: 1, dateAdded: date})
}

sequelize.sync({ force: true }).then(() => {
  console.log("Sequelize Sync Completed...");
  setup().then(() => console.log("Setup complete"));
});

module.exports = app;
