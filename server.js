const express = require("express");
const methodOverride = require("method-override");
require("./db");
const path = require('path');
const customerAPIRoutes = require("./routes/customerApiRoutes");


const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(methodOverride("method"));

app.use(customerAPIRoutes);


app.get("/", function (req, res) {
  res.status(200).send("welcome")
});

app.listen(1234, function () {
  console.log("Server started");
});
