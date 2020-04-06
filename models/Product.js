const mongoose = require('mongoose')
//const Review = require('./Review')
const Schema = mongoose.Schema;
const productSchema = new Schema(
	{
		name: { type: String, trim: true, required: true },
		description: { type: String, trim: true, required: true },
		price: { type: Object, required: true },
		category: { type: Schema.Types.ObjectId, ref: 'category' },
		storeStaff: { type: Schema.Types.ObjectId, ref: 'storeStaff' },
		stockAvailable: { type: Boolean, default: true },
		quantities: { type: [String], required: true },
		distributor: { type: String },
		photos: { type: [String], required: true }
	},
	{ timestamps: true }
)

productSchema.methods = {
	toJSON: function () {
		const product = this.toObject()
		delete product.__v
		return product
	}
}



const Product = mongoose.model('product', productSchema)
module.exports = Product
