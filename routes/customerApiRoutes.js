// Import the express module
var express = require("express");
var authenticate = require("../middleware/authenticate");
var customerApiControllers = require("../controllers/customerApiControllers");

// Instance of a router is created with express.Router()
var router = express.Router();

router.post("/customers/register", customerApiControllers.registerCustomer);

router.post("/customers/login", customerApiControllers.loginCustomer);

router.delete("/customers/logout",authenticate, customerApiControllers.logOutCustomer);
router.delete("/customers/deactivate",authenticate, customerApiControllers.deactivateCustomer);


router.get("/profile",authenticate, customerApiControllers.showProfile);
module.exports = router;
