const mongoose= require('mongoose')
const Schema=mongoose.Schema
const cartSchema = new Schema({
    owner: {type: Schema.Types.ObjectId, ref: 'customer'},
	total: {type: Number, default: 0},
	items: [{
		item: {type: Schema.Types.ObjectId, ref: 'product'},
		quantity: {type: Number, default: 1},
		price: {type: Number, default: 0}
    }],
    coupon: {
        code: { type: String },
		value: { type: Number },
		type:{type:String}
      },
},
	{ timestamps: true }
)

cartSchema.methods = {
	toJSON: function() {
		const cart = this.toObject()
		delete cart.__v
		return cart
	}
}

const Cart = mongoose.model('cart', cartSchema)
module.exports = Cart
