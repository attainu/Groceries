
var Customer = require("../models/Customer");

module.exports = {
  async registerCustomer(req, res) {
    try {
      const customer = await Customer.create({ ...req.body });
      const newCustomer = await customer.generateAuthToken();
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
      const newCustomer = await customer.generateAuthToken();
      const customerId = newCustomer.id;
      await Customer.updateOne(
        { _id: customerId },
        { $set: newCustomer },
        { new: true }
      )
      console.log(newCustomer)
      return res.status(201).json({status:200,message:`${newCustomer.name} Welcome Back`,customer:newCustomer});

    } catch (err) {
      console.log(err.message);
      res.send(err.message);
    }
  },



  async logOutCustomer(req, res) {
    const customer = req.customer;
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

  }


};
