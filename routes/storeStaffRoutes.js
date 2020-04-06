
var express = require("express");
var authenticate = require("../middleware/authenticate");
var admin = require("../middleware/admin");
//const passport = require("passport");
var storeStaffControllers = require("../controllers/storeStaffController");


var router = express.Router();

router.post("/storeStaffs/register", storeStaffControllers.registerStoreStaff);

router.post("/storeStaffs/login", storeStaffControllers.loginStoreStaff);

router.delete("/storeStaffs/logout",authenticate.storeStaffAuthenticate, storeStaffControllers.logOutStoreStaff);
router.delete("/storeStaffs/deactivate",authenticate.storeStaffAuthenticate, storeStaffControllers.deactivateStoreStaff);


//router.get("/profile",authenticate, storeStaffControllers.showProfile);
router.get("storeStaffs/member",authenticate.storeStaffAuthenticate,admin,getAllStoreStaff);
router.delete("storeStaffs/member/:storeStaffId",authenticate.storeStaffAuthenticate,admin,deleteStoreStaffById);

module.exports = router;
