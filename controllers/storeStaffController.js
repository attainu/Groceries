const StoreStaff = require("../models/StoreStaff");

module.exports = {
  async registerStoreStaff(req, res) {
    try {
      const{name ,email,password }=req.body
      if (!email || !name || !password) {
        return res
          .status(400)
          .send({ statusCode: 400, message: "Bad requestsss" });
      }
      const storeStaff = await StoreStaff.create({
        email,
        name,
        password
      });
      const newStoreStaff = await storeStaff.generateAuthToken();
      await newStoreStaff.save();
      res.status(200).json({status:200,message:`${newStoreStaff.name} register successfully`,storeStaff:newStoreStaff});
    } catch (err) {
      console.log(err);
      res.send(err.message);
    }
  },
//   async showProfile(req, res) {
//     try {
//       const storeStaffId=req.storeStaff.id
//       console.log(storeStaffId)
//       const storeStaff = await StoreStaff.findOne({_id:storeStaffId}).populate("address");
//      //console.log(storeStaff)
//       res.status(200).json({storeStaffProfile:storeStaff});
//     } catch (err) {
//       console.log(err);
//       res.send(err.message);
//     }
//   },

  async loginStoreStaff(req, res) {
    // Get the storeStaffs json file
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).send("Incorrect credentials");
    try {
      const storeStaff = await StoreStaff.findByEmailAndPassword(email, password);
      const newStoreStaff = await storeStaff.generateAuthToken();
      const storeStaffId = newStoreStaff.id;
      await StoreStaff.updateOne(
        { _id: storeStaffId },
        { $set: newStoreStaff },
        { new: true }
      )
      console.log(newStoreStaff)
      return res.status(201).json({status:200,message:`${newStoreStaff.name} Welcome Back`,storeStaff:newStoreStaff});

    } catch (err) {
      console.log(err.message);
      res.send(err.message);
    }
  },



  async logOutStoreStaff(req, res) {
    const storeStaff = req.storeStaff;
    const storeStaffId = storeStaff.id;
    console.log(storeStaff,"log")
    storeStaff.accessToken = null;
    const newStoreStaff = storeStaff;
    try {

      await StoreStaff.updateOne(
        { _id: storeStaffId },
        { $set: newStoreStaff },
        { new: true }
      )
      if (!storeStaff) return res.status(404).send("storeStaff not found");
      console.log(storeStaff, "new");
      return res.status(201).json({status:200,message:`bye for now ${newStoreStaff.name} `,storeStaff:newStoreStaff});
    } catch (err) {
      console.log(err.message);
      res.send(err.message);
    }
  },
  async deactivateStoreStaff(req,res){
    try{
      const storeStaff = req.storeStaff;
      //console.log(storeStaff,"fffffffff")
       const storeStaffId=storeStaff._id
      const storeStaffFind=await StoreStaff.findOne({_id:storeStaffId})
  
  await storeStaffFind.remove()
     // console.log(storeStaff);
      res.status(201).json({ name: storeStaffFind.name, message: "deactivate storeStaff"});
    
   
    }catch(err){
      res.send(err.message);
    }

  },
  //admin's routes  
  async getAllStoreStaff(req, res) {
        try {
          const storeStaff = await StoreStaff.findOne({});
         //console.log(storeStaff)
          res.status(200).json({allstoreStaff:storeStaff});
        } catch (err) {
          console.log(err);
          res.send(err.message);
        }
      },
  async deleteStoreStaff(req, res) {
        try {
          const storeStaffId=req.params.storeStaffId
          const storeStaff = await StoreStaff.findOne({storeStaffId});
         //console.log(storeStaff)
         await storeStaff.remove();
          res.status(200).json({allstoreStaff:storeStaff});
        } catch (err) {
          console.log(err);
          res.send(err.message);
        }
      },
  
 

};
