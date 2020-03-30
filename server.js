const express = require("express");
const methodOverride = require("method-override");
const passport = require("passport");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
dotenv.config();
require("./db");
require("./passport");
const path = require('path');

const customerAPIRoutes = require("./routes/customerApiRoutes");
const addressRoutes = require("./routes/addressRoutes");
const storeStaffRoutes = require("./routes/storeStaffRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");

const app = express();
app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:1234",
    credentials: true,
    allowedHeaders: ["Content-Type"]
  })
);

app.use(express.urlencoded({ extended: false }));

app.use(methodOverride("method"));

app.use(customerAPIRoutes);
app.use(addressRoutes);
app.use(storeStaffRoutes);
app.use(categoryRoutes);
app.use(productRoutes);
app.use(cartRoutes);

app.get("/", function (req, res) {
  res.status(200).send("welcome")

});

app.listen(1234, function () {
  console.log("Server started");
});
