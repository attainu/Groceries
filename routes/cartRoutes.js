const express = require('express')
const authenticate = require('../middleware/authenticate')
var router = express.Router();

const cartControllers = require('../controllers/cartController')
 router.get('/cart',authenticate.customerAuthenticate, cartControllers.getCart)
router.post('/cart/:productId',authenticate.customerAuthenticate,cartControllers.createCart)
router.delete('/cart/:productId',authenticate.customerAuthenticate,cartControllers.removeCartItem)
router.delete('/cart',authenticate.customerAuthenticate,cartControllers.removeCart)

module.exports = router