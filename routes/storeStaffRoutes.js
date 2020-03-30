
var express = require("express");
var authenticate = require("../middleware/authenticate");
//const passport = require("passport");
var storeStaffControllers = require("../controllers/storeStaffController");


var router = express.Router();

router.post("/storeStaffs/register", storeStaffControllers.registerStoreStaff);

router.post("/storeStaffs/login", storeStaffControllers.loginStoreStaff);

router.delete("/storeStaffs/logout",authenticate.storeStaffAuthenticate, storeStaffControllers.logOutStoreStaff);
router.delete("/storeStaffs/deactivate",authenticate.storeStaffAuthenticate, storeStaffControllers.deactivateStoreStaff);


//router.get("/profile",authenticate, storeStaffControllers.showProfile);

module.exports = router;
