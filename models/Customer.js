const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const passwords = require('../passwords/passwords')
const sendEmail = require("../utils/sendEmail");
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
      required: function() {
        return !this.isThirdPartyUser;
      },
      trim: true
    },
    isThirdPartyUser: {
      type: Boolean,
      required: true
    },
    accessToken: {
      type: String, 
    },
   mailConfirmed: {
      type: Boolean,
      default:false
    },

    address: [
      {
        type: Schema.Types.ObjectId,
        ref: "address"
      }
    ]
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

customerSchema.methods.toJSON = function() {
  const customer = this.toObject();
  delete customer.password;
  delete customer.accessToken;
  delete customer.__v;
  // Super important
  return customer;
};

customerSchema.methods={
  generateAuthTokenConfirmation: async function (){
    const customer=this;
    console.log(customer);
    const id=customer.id
   
 const token=await jwt.sign({customerId:id},privateKey,{ expiresIn: "12h"})
  
      console.log(token);
      customer.accessToken=token;
      console.log(customer)
      await sendEmail(customer.email, token);
      return customer
      
    
    },
  generateAuthToken: async function (){
    const customer=this;
    console.log(customer);
    const id=customer.id
   
 const token=await jwt.sign({customerId:id},privateKey,{ expiresIn: "12h"})
  
      console.log(token);
      customer.accessToken=token;
      console.log(customer)
     // await sendEmail(customer.email, token);
      return customer
      
    
    }


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
