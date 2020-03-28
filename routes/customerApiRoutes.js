// Import the express module
var express = require("express");
var authenticate = require("../middleware/authenticate");
const passport = require("passport");
var customerApiControllers = require("../controllers/customerApiControllers");

// Instance of a router is created with express.Router()
var router = express.Router();

router.post("/customers/register", customerApiControllers.registerCustomer);

router.post("/customers/login", customerApiControllers.loginCustomer);

router.delete("/customers/logout",passport.authenticate("jwt", { session: false }), customerApiControllers.logOutCustomer);
router.delete("/customers/deactivate",authenticate, customerApiControllers.deactivateCustomer);


router.get("/profile",authenticate, customerApiControllers.showProfile);


router.get(
    "/google",
    passport.authenticate("google", {
      session: false,
      scope: ["profile", "email"]
    })
  );

router.get(
    "/google/redirect",
    passport.authenticate("google", {
      session: false,
      failureRedirect: "failture login"
    }),
    customerApiControllers.loginWithGoogleUser
  );
module.exports = router;
