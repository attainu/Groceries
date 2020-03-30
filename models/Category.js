const mongoose = require('mongoose')
const Product = require('./Product')
const Schema = mongoose.Schema;
const categorySchema = new Schema({
  name: { type: String, required: true }
}, { timestamps: true })

categorySchema.methods = {
  toJSON: function () {
    const category = this.toObject()
    delete category.__v
    return category
  }
}

categorySchema.pre('remove', async function (next) {
  await Product.deleteMany({ category: this._id })
  next()
})

const Category = mongoose.model('category', categorySchema)
module.exports = Category