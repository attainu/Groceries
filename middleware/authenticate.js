
var jwt = require('jsonwebtoken');
var Customer = require('../models/Customer');

var passwords = require('../passwords/passwords');

var privateKey = passwords.privateKey;
module.exports = async (req, res, next) => {
  
  try {

    var authToken = req.header('Authorization');
    console.log(authToken);
    if (authToken) {
      const customerFind = await Customer.findOne({ accessToken: authToken })

      console.log(customerFind, "h ath")
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

}

