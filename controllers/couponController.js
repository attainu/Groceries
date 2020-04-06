
const Coupon = require('../models/Coupon')
const Cart=require('../models/Cart')
module.exports = {
  createCoupon: async (req, res) => {
    try {
      let coupon = await Coupon.findOne({
        code: req.body.name,
        type:req.body.type,
        value: req.body.value
      })
      if (coupon) return res.send({ statusCode: 200, coupon })
      coupon = await Coupon.create(req.body)
      res.status(201).send({ statusCode: 201, coupon })
    } catch (err) {
      res.status(500).send({ statusCode: 500, message: 'Server Error' })
    }
  },

  fetchAllCoupons: async (req, res) => {
    try {
      const coupons = await Coupon.find({
        expiresAt: { $gt: new Date().getTime() }
      }).sort('-createdAt')
      res.send({ statusCode: 200, coupons })
    } catch (err) {
      res.status(500).send({ statusCode: 500, message: 'Server Error' })
    }
  },

  deleteCouponById: async (req, res) => {
   
    try {
      const couponId = req.params.couponId
      if (!couponId)
        return res
          .status(400)
          .send({ statusCode: 400, message: 'Coupon Id required' })
      const coupon = await Coupon.findByIdAndDelete(couponId)
      if (!coupon)
        return res
          .status(404)
          .send({ statusCode: 404, message: 'Coupon does not exist' })
      res.status(202).send({ statusCode: 202, coupon })
    } catch (err) {
      if (err.name === 'CastError')
        return res
          .status(400)
          .send({ statusCode: 400, message: 'Invalid Coupon Id' })
      res.status(500).send({ statusCode: 500, message: 'Server Error' })
    }
  },

  fetchCouponById: async (req, res) => {
    try {
      const couponId = req.params.couponId
      if (!couponId)
        return res
          .status(400)
          .send({ statusCode: 400, message: 'Coupon Id required' })
      const coupon = await Coupon.findById(couponId)
      if (!coupon)
        return res
          .status(404)
          .send({ statusCode: 404, message: 'Coupon does not exist' })
      res.send({ statusCode: 202, coupon })
    } catch (err) {
      if (err.name === 'CastError')
        return res
          .status(400)
          .send({ statusCode: 400, message: 'Invalid Coupon Id' })
      res.status(500).send({ statusCode: 500, message: 'Server Error' })
    }
  },

  updateCouponById: async (req, res) => {
    try {
      const couponId = req.params.couponId
      if (!couponId)
        return res
          .status(400)
          .send({ statusCode: 400, message: 'Coupon Id required' })
      const coupon = await Coupon.findByIdAndUpdate(req.body)
      if (!coupon)
        return res
          .status(404)
          .send({ statusCode: 404, message: 'Coupon does not exist' })
      res.send({ statusCode: 202, coupon })
    } catch (err) {
      if (err.name === 'CastError')
        return res
          .status(400)
          .send({ statusCode: 400, message: 'Invalid Coupon Id' })
      res.status(500).send({ statusCode: 500, message: 'Server Error' })
    }
  },




  // Apply Coupon
  applyCoupon: async (req, res) => {
    try {
      const { code, cartId } = req.body
      const coupon = await Coupon.findOne({
        code: code,
       // expiresAt: { $gt: new Date().getTime() }
      })
      console.log(coupon)
      if (!coupon)
        return res
          .status(404)
          .send({ statusCode: 404, message: 'Invalid Coupon' })
      const cart = await Cart.findById(cartId)
      console.log(cart)
      if (!cart)
        return res
          .status(404)
          .send({ statusCode: 404, message: 'Cart not found' })

     const subTotal=cart.total  
      if (subTotal < coupon.minimumOrderAmount && subTotal>maximumOderAmount)
        return res
          .status(400)
          .send({
            statusCode: 400,
            message: `Order value must be between $${coupon.minimumOrderAmount} and $${coupon.maximumOderAmount}`
          })
      const { code: couponCode, value,type } = coupon
      cart.coupon = { code: couponCode, value,type }
      await cart.save()
      res.status(202).send({ statusCode: 202, coupon: cart.coupon })
    } catch (err) {
      res.status(500).send({ statusCode: 500, message: 'Server Error' })
    }
  },

  // Remove Applied coupon
  removeAppliedCoupon: async (req, res) => {
    try {

      const  customerId  = req.customer._id
      console.log(customerId)
      const cart = await Cart.findOne({owner:customerId})
      if (!cart)
        return res
          .status(404)
          .send({ statusCode: 404, message: 'Cart not found' })
          console.log(cart.coupon)
      cart.coupon = undefined
      await cart.save()
      res.status(202).send({ statusCode: 202, coupon: {} })
    } catch (err) {
      res.status(500).send({ statusCode: 500, message: 'Server Error' })
    }
  },



}
