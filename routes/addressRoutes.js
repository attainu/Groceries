var express = require("express");
var authenticate = require("../middleware/authenticate");
var addressControllers = require("../controllers/addressController");

// Instance of a router is created with express.Router()
var router = express.Router();


router.post("/addAddress",authenticate.customerAuthenticate, addressControllers.addAddress);
router.delete("/deleteAddress/:addressId",authenticate.customerAuthenticate, addressControllers.deleteAddress);
router.patch("/updateAddress/:addressId",authenticate.customerAuthenticate, addressControllers.updateAddress);


module.exports = router;