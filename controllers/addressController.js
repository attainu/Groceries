
//var Customer = require("../models/Customer");
var Address = require("../models/Address");

module.exports = {
  
  async addAddress(req, res) {
    try {
      const address = await Address.create({ ...req.body });
     const customer= req.customer;
     console.log(address.id)
      customer.address.push(address._id)
      //const customerToken = await customer.generateAuthToken();
     await customer.save();
      await address.save();
      res.status(200).json({status:200,addedAdress:address,customerDetail:customer});
    } catch (err) {
      console.log(err);
      res.send(err.message);
    }
  },
  async deleteAddress(req, res) {
    try {
        const customer = req.customer;
        const addressId = req.params.addressId
        const addressFind=await Address.findOne({_id:addressId})
        await addressFind.remove()
        const addressIndex = customer.address.findIndex(function (pro) {
            return pro == addressId
        })
        customer.address.splice(addressIndex, 1)
       await customer.save()
       res.status(200).json({status:200,message:"address deleted",customerDetail:customer});
    } catch (err) {
      console.log(err);
      res.send(err.message);
    }
  },
  async  updateAddress(req, res) {
    try {
      const customer=req.customer;
        const addressId = req.params.addressId
        const newaddress =  req.body 
      const address=  await Address.updateOne(
            { _id: addressId },
            { $set: newaddress },
            { new: true }
          )
          if (!address) return res.status(404).send("address not found");
          console.log(address, "new");
          res.status(200).json({status:200,addedAdress:"address update",customerDetail:customer});
        return res.json(address)
    } catch (err) {
      console.log(err);
      res.send(err.message);
    }
  }

};
