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
const OrderItem = require("./models/OrderItem")
const { v4: uuidv4 } = require('uuid');

var indexRouter = require("./routes/index");
var storeRouter = require("./routes/store");
var accountRouter = require("./routes/account");
const Library = require("./models/Library");

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
  await Publisher.create({ publisherid: 0, publishername: 'onepagerules', publisherdesc: 'onepagerules description' });
  await Publisher.create({ publisherid: 1, publishername: 'Mongoose', publisherdesc: 'Mongoose description' });
  await Publisher.create({ publisherid: 2, publishername: 'EDGE Studio', publisherdesc: 'EDGE Studio description' });
  await Publisher.create({ publisherid: 3, publishername: 'Dragonworks', publisherdesc: 'Dragonworks description' });
  await Publisher.create({ publisherid: 4, publishername: 'Musing Design', publisherdesc: 'Musing Design description' });
  await Publisher.create({ publisherid: 5, publishername: 'Modiphius', publisherdesc: 'Modiphius description' });

  await Product.create({ productid: 0, publisherid: 0, productname: 'Grimdark Future World Book', productimage: 'GrimdarkFutureWorldBook.jpg', productdesc: 'Grimdark Future is a story set in a war-torn sci-fi future, where humanity struggles to survive in a new galaxy. This is a universe filled with epic conflicts, mighty heroes, and daring adventurers, where species and factions face off in a battle for supremacy.', productprice: 14.99 });
  await Product.create({ productid: 1, publisherid: 1, productname: 'This is Free Trader Beowulf', productimage: 'ThisIsFreeTraderBeowulf.jpg', productdesc: 'A complete history of Traveller from its inspirations in the early ’70s, though its initial publication, and across seven distinct editions of its original 2d6 gaming system.', productprice: 30.00 });
  await Product.create({ productid: 2, publisherid: 2, productname: 'Genesys - War for the Throne', productimage: 'Genesys.jpg', productdesc: 'A­fter their defeat thousands of years in the past, everybody thought that they were gone forever. But now, the Mahact Gene-Sorcerers are back! And the return of those baleful tyrants has plunged the galaxy into chaos and panic.', productprice: 26.99 });
  await Product.create({ productid: 3, publisherid: 1, productname: 'The Fifth Frontier War', productimage: 'TheFifthFrontierWar.jpg', productdesc: 'The Third Imperium has fought four Frontier Wars against the Zhodani Consulate and its allies. Worlds have changed hands, borders have been readjusted, but never has the Imperium been seriously threatened… until now. As Zhodani battle fleets emerge from jumpspace at Regina, Efate, and Jewell, something is different this time.', productprice: 29.99 });
  await Product.create({ productid: 4, publisherid: 3, productname: 'Essential NPCs', productimage: 'EssentialNPCs.png', productdesc: '', productprice: 19.99 });
  await Product.create({ productid: 5, publisherid: 4, productname: 'Achtung! Cthulhu 2d20 Starter Set (PDF)', productimage: 'AchtungCthulhu.png', productdesc: 'Welcome to the Secret War! In this Achtung! Cthulhu 2d20 starter set, you’ll get your first glimpse into the hidden globe-spanning conflict between the forces of good and evil! Only you and your scrappy band of heroes can defeat the malignant forces of the occult, and the malevolent might of their Mythos masters!', productprice: 20.00 });

  const uid1 = uuidv4()
  const uid2 = uuidv4()

  await User.create({userid: uid1, username: "testuser", password: "123"})
  await User.create({userid: uid2, username: "testadmin", password: "123", isAdmin: true})

  const date = new Date('2024-04-16');
  const date2 = new Date('2024-05-12');

  await Library.create({userid: uid1, productid: 1, purchaseDate: date, downloadDate: date2})
  await Library.create({userid: uid1, productid: 2, purchaseDate: date, downloadDate: date2})
  await Library.create({userid: uid2, productid: 3, purchaseDate: date, downloadDate: date2})
  await Library.create({userid: uid2, productid: 4, purchaseDate: date, downloadDate: date2})
  
  await ShoppingCart.create({userid: uid1, productid: 1, quantity: 90, dateAdded: date})
  await ShoppingCart.create({userid: uid1, productid: 4, quantity: 10, dateAdded: date})
  await Order.create({orderid: 1, userid: uid1, status: "On the way", dateOrdered: date, paymentOption: 1111})
  await Order.create({orderid: 2, userid: uid1, status: "Not yet shipped", dateOrdered: date, paymentOption: 1111})
  await OrderItem.create({orderid: 1, productid: 3, quantity: 42})
  await OrderItem.create({orderid: 1, productid: 1, quantity: 12})
  await OrderItem.create({orderid: 1, productid: 2, quantity: 7})
  await OrderItem.create({orderid: 2, productid: 5, quantity: 323})
  await Wishlist.create({userid: uid1, productid: 1, dateAdded: date})
}

sequelize.sync({ force: true }).then(() => {
  console.log("Sequelize Sync Completed...");
  setup().then(() => console.log("Setup complete"));
});

module.exports = app;
