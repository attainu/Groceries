const express = require('express')
const authenticate = require('../middleware/authenticate')
var router = express.Router();
const { createCoupon, fetchAllCoupons, deleteCouponById, fetchCouponById, updateCouponById ,applyCoupon,removeAppliedCoupon} = require('../controllers/couponController')


router.get('/coupon', fetchAllCoupons)
//Get coupon by ID
router.get('/coupon/:couponId', authenticate.storeStaffAuthenticate,  fetchCouponById)
router.post('/coupon', authenticate.storeStaffAuthenticate,createCoupon)
router.put('/coupon/:couponId', authenticate.storeStaffAuthenticate, updateCouponById)
router.delete('/:couponId', authenticate.storeStaffAuthenticate, deleteCouponById)


//coupon redeem by customer
router.patch('/coupon/redeem',authenticate.customerAuthenticate, applyCoupon)
router.patch('/coupon/unredeem',authenticate.customerAuthenticate, removeAppliedCoupon)


module.exports = router