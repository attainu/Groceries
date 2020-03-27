const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const passwords = require('../passwords/passwords')
const privateKey = passwords.privateKey

const Schema = mongoose.Schema;

const customerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      unique: true,
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    accessToken: {
      type: String, 
    },

    // products: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "product"
    //   }
    // ]
  },
  { timestamps: true }
);

customerSchema.statics.findByEmailAndPassword = function(email, password) {
var customerObj = null;
  return new Promise(function(resolve, reject) {
    Customer.findOne({ email: email })
      .then(function(customer) {
        if (!customer) reject("Incorrect credentials");
        customerObj = customer;
        return bcrypt.compare(password, customer.password);
      })
      .then(function(isMatched) {
        if (!isMatched) reject("Incorrect credentials");
        resolve(customerObj);
      })
      .catch(function(err) {
        reject(err);
      });
  });
};


customerSchema.pre("save", function(next) {
  const customer = this;
  // Check whether password field is modified
  if (customer.isModified("password")) {
    bcrypt
      .hash(customer.password, 10)
      .then(function(hashedPassword) {
        customer.password = hashedPassword;
        next();
      })
      .catch(function(err) {
        next(err);
      });
  }
 else next();
  
});


customerSchema.methods.generateAuthToken=function(){
  const customer=this;
  console.log(customer);
  const id=customer.id
  return new Promise(function(resolve,reject){
   jwt.sign({customerId:id},privateKey,{ expiresIn: 60 * 60 * 12 },function(err,token){

    console.log(token);
    customer.accessToken=token;
    console.log(customer)
   
    resolve(customer);
    
    })
  // }
   })

}




// customerSchema.pre("remove", function(next) {
//   Product.deleteMany({ customer: this._id })
//     .then(function() {
//       next();
//     })
//     .catch(function(err) {
//       next(err);
//     });
// });

const Customer = mongoose.model("customer", customerSchema);

module.exports = Customer;
