var express = require("express");
var authenticate = require("../middleware/authenticate");
var addressControllers = require("../controllers/addressController");

// Instance of a router is created with express.Router()
var router = express.Router();


router.post("/addAddress",authenticate, addressControllers.addAddress);
router.delete("/deleteAddress/:addressId",authenticate, addressControllers.deleteAddress);
router.patch("/updateAddress/:addressId",authenticate, addressControllers.updateAddress);


module.exports = router;