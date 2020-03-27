const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    houseNO: {
      type: String,
      required: true,
      trim: true
    },
    area: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    postCode: {
      type: Number,
      required: true,
      trim: true
    },
    phoneNo: {
      type: Number,
      required: true,
      trim: true
    }

  },
  { timestamps: true }
);


const Address = mongoose.model("address", addressSchema);

module.exports = Address;