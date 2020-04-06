
var Customer = require("../models/Customer");
var jwt = require('jsonwebtoken');
var passwords = require('../passwords/passwords');

var privateKey = passwords.privateKey;

module.exports = {
  async registerCustomer(req, res) {
    try {
      const{name ,email,password }=req.body
      if (!email || !name || !password) {
        return res
          .status(400)
          .send({ statusCode: 400, message: "Bad requestsss" });
      }
      const customer = await Customer.create({
        email,
        name,
        password,
        isThirdPartyUser: false
      });
      const { gmailUser, gmailPass } = process.env;
      console.log(gmailUser,gmailPass)
      const newCustomer = await customer.generateAuthTokenConfirmation();
      await newCustomer.save();
      res.status(200).json({status:200,message:`${newCustomer.name} register successfully`,customer:newCustomer});
    } catch (err) {
      console.log(err);
      res.send(err.message);
    }
  },
  async showProfile(req, res) {
    try {
      const customerId=req.customer.id
      console.log(customerId)
      const customer = await Customer.findOne({_id:customerId}).populate("address");
     //console.log(customer)
      res.status(200).json({customerProfile:customer});
    } catch (err) {
      console.log(err);
      res.send(err.message);
    }
  },

  async loginCustomer(req, res) {
    // Get the customers json file
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).send("Incorrect credentials");
    try {
      const customer = await Customer.findByEmailAndPassword(email, password);
      if(customer.mailConfirmed){
      const newCustomer = await customer.generateAuthToken();
      const customerId = newCustomer.id;
      await Customer.updateOne(
        { _id: customerId },
        { $set: newCustomer },
        { new: true }
      )
      console.log(newCustomer)
      return res.status(201).json({status:200,message:`${newCustomer.name} Welcome Back`,customer:newCustomer});
      }
      else{
        return res
        .status(403)
        .send("You havent confirmed your account. Please check your mail");
      }
    } catch (err) {
      console.log(err.message);
      res.send(err.message);
    }
  },



  async logOutCustomer(req, res) {
    const customer = req.user;
    const customerId = customer.id;
    customer.accessToken = null;
    const newCustomer = customer;
    try {

      await Customer.updateOne(
        { _id: customerId },
        { $set: newCustomer },
        { new: true }
      )
      if (!customer) return res.status(404).send("customer not found");
      console.log(customer, "new");
      return res.status(201).json({status:200,message:`bye ${newCustomer.name} `,customer:newCustomer});
    } catch (err) {
      console.log(err.message);
      res.send(err.message);
    }
  },
  async deactivateCustomer(req,res){
    try{
      const customer = req.customer;
      //console.log(customer,"fffffffff")
       const customerId=customer._id
      const customerFind=await Customer.findOne({_id:customerId})
  
  await customerFind.remove()
     // console.log(customer);
      res.status(201).json({ name: customerFind.name, message: "deactivate customer"});
    
   
    }catch(err){
      res.send(err.message);
    }

  },
  
  async loginWithGoogleUser(req, res) {
    const customer = req.user;
    console.log(customer)
    const customerT = await customer.generateAuthToken();
    await customerT.save();
    const accessToken=customerT.accessToken;
    res.cookie("accessToken", accessToken, {
      expires: new Date(Date.now() + 100 * 60 * 60 * 24),
      httpOnly: true,
      sameSite: "none"
    });
    res.redirect("http://localhost:1234/");
  },

  CustomerCangePassword: async (req, res) => {
    const oldPassword = req.body.oldPassword
    const  newPassword  = req.body.newPassword
    const  customerId= req.customer.id
    if (oldPassword === newPassword)
      return res.status(400).send({
        statusCode: 400,
        message: 'Old Password and New Password should not be same '
      })
    try {
      const customer = await User.findById(customerId)
      const isMatched = await bcrypt.compare(oldPassword, customer.password)
      if (!isMatched)
        return res.status(401).send({
          statusCode: 401,
          message: 'Incorrect old password '
        })
      customer.password = newPassword;
      await customer.save();
      res
        .status(202)
        .send({ statusCode: 202, message: 'Password  successfully changed' })
    } catch (err) {
      res.status(500).send({ statusCode: 500, message: 'Server Error' })
    }
  },
  async renderConfirmEmail(req, res) {
    const  confirmToken  = req.params.confirmToken;
    try {
      
      const customer = await Customer.findOne({ accessToken:confirmToken } );
      if (!customer) {
        return res.status(401).send("Invalid Credentials");
      }
      req.customer = customer;
      const payload = await jwt.verify(confirmToken, privateKey);
      console.log(payload);
      if (payload) {
       req.customer.mailConfirmed=true
        await Customer.updateOne(
          { _id: customer._id },
          { $set: req.customer },
          { new: true }
        )
        req.customer = undefined;
        return res.status(200).send("your email confirmed, welcome ")
      }
    } catch (err) {
      console.log(err);
      if (err.name === "TokenExpiredError") {
      await  req.customer.generateAuthToken();
           await req.customer.save();
        return res.status(202).send("your confirmation token is expired......and now we are automatically regenerateing confirmation email because we are not allowed to use client-side plz check your mail ");
      }
      console.log(err.message);
    }
  }

};
