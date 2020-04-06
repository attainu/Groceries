const { Schema, model } = require('mongoose')
const Cart = require('./Cart')

const ordersSchema = new Schema(
  {
    method: { type: String, default: 'cash' },
    paymentStatus: { type: String, default: 'pending' },
    orderStatus: { type: String, enum: ['confirmed','packed', 'outForDelivery','delivered'] ,default: 'confirmed'},
    products:  [{
      item: {type: Schema.Types.ObjectId, ref: 'product'},
      quantity: {type: Number, default: 1},
      price: {type: Number, default: 0}
      }],
    user: { type: Schema.Types.ObjectId, required: true, ref: 'customer' },
    cart: { type: Schema.Types.ObjectId, required: true, ref: 'cart' },
    coupon: { type: String, required: true },
    invoiceAddress: {
      name: String,
      address1: String,
      address2: String,
      city: String,
      state: String,
      country: { type: String, default: 'INDIA' },
      postalCode: Number,
      phNumber: Number,
    },
    totalAmount: Number,
    expiryDate: Date,
    paidAt: Date
  },
  { timestamps: true }
)

ordersSchema.methods = {
  toJSON: function() {
    const order = this.toObject()
    delete order.__v
    return order
  }
}

const Order = model('order', ordersSchema)
module.exports = Order
