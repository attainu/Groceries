const express = require('express')
const router = express.router()
const authenticate = require('../middleware/authenticate')
const {
  createOrder,
  changePaymentMethod,
  fetchOrderById,
  changeOrderStatus,
  changePaymentStatus,
  customerOrderHistory,
	cancelOrderById
} = require('../controllers/orderController')

router.get('/order/:orderId',authenticate.customerAuthenticate, fetchOrderById)


router.get('/order/history',authenticate.customerAuthenticate, customerOrderHistory)
router.patch('/order/paymentMethod/:orderId',authenticate.customerAuthenticate, changePaymentMethod)


router.post('/order',authenticate.customerAuthenticate, createOrder)
router.delete('/order/:orderId',authenticate.customerAuthenticate, cancelOrderById)
//store api
router.patch('/order/paymentStatus/:orderId',authenticate.storeStaffAuthenticate, changePaymentStatus)
router.patch('/order/orderStatus/:orderId',authenticate.storeStaffAuthenticate, changeOrderStatus)



module.exports = router
