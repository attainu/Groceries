
var jwt = require('jsonwebtoken');
var Customer = require('../models/Customer');
var StoreStaff = require('../models/StoreStaff');

var passwords = require('../passwords/passwords');

var privateKey = passwords.privateKey;
module.exports = {
  
  async customerAuthenticate (req, res, next) {
  
  try {

    var authToken = req.header('Authorization');
    console.log(authToken);
    if (authToken) {
      const customerFind = await Customer.findOne({ accessToken: authToken })

     
      jwt.verify(customerFind.accessToken, privateKey, function (err, payload) {
        if (err) {
          console.log(err);
          return res.status(401).send('Invalid credentialsgggggg');
        } else {

          req.customer = customerFind;

          return next();
        }
      })
    }
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }

},
 
async storeStaffAuthenticate (req, res, next) {
  
  try {

    var authToken = req.header('Authorization');
    console.log(authToken);
    if (authToken) {
      const storeStaffFind = await StoreStaff.findOne({ accessToken: authToken })
      if(!storeStaffFind) return res.status(400).json({status:400,message:"invaild credential"})
      
      jwt.verify(storeStaffFind.accessToken, privateKey, function (err, payload) {
        if (err) {
          console.log(err);
          return res.status(401).send('Invalid credentials');
        } else {
 
          req.storeStaff = storeStaffFind;
         // console.log(req.storeStaff,"mid");
          return next();
        }
      })
    }
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }

}
}