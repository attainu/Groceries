const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const passwords = require('../passwords/passwords')
const privateKey = passwords.privateKey

const Schema = mongoose.Schema;

const storeStaffSchema = new Schema(
  {
    UserType: {
      type: String,
      default:"Store Staff"
    },
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
      type: String 
    },
    Admin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

storeStaffSchema.statics.findByEmailAndPassword = function(email, password) {
var storeStaffObj = null;
  return new Promise(function(resolve, reject) {
    StoreStaff.findOne({ email: email })
      .then(function(storeStaff) {
        if (!storeStaff) reject("Incorrect credentials");
        storeStaffObj = storeStaff;
        return bcrypt.compare(password, storeStaff.password);
      })
      .then(function(isMatched) {
        if (!isMatched) reject("Incorrect credentials");
        resolve(storeStaffObj);
      })
      .catch(function(err) {
        reject(err);
      });
  });
};


storeStaffSchema.pre("save", function(next) {
  const storeStaff = this;
  // Check whether password field is modified
  if (storeStaff.isModified("password")) {
    bcrypt
      .hash(storeStaff.password, 10)
      .then(function(hashedPassword) {
        storeStaff.password = hashedPassword;
        next();
      })
      .catch(function(err) {
        next(err);
      });
  }
 else next();
  
});

storeStaffSchema.methods.toJSON = function() {
  const storeStaff = this.toObject();
  delete storeStaff.password;
  delete storeStaff.accessToken;
  delete storeStaff.__v;
  // Super important
  return storeStaff;
};

storeStaffSchema.methods.generateAuthToken=function(){
  const storeStaff=this;
  console.log(storeStaff);
  const id=storeStaff.id
  return new Promise(function(resolve,reject){
   jwt.sign({storeStaffId:id},privateKey,{ expiresIn: '12h'},function(err,token){

    console.log(token);
    storeStaff.accessToken=token;
    console.log(storeStaff)
   
    resolve(storeStaff);
    })
   })

}




storeStaffSchema.pre("remove", function(next) {
  Product.deleteMany({ storeStaff: this._id })
    .then(function() {
      next();
    })
    .catch(function(err) {
      next(err);
    });
});

const StoreStaff= mongoose.model("storeStaff", storeStaffSchema);

module.exports = StoreStaff;
