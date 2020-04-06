const express = require('express')
const authenticate = require('../middleware/authenticate')
var router = express.Router();

const productControllers = require('../controllers/productController')

// POST/products/ create product by category id
router.post('/product/:categoryId',authenticate.storeStaffAuthenticate,productControllers.createProduct)
//PUT /api/products/:productId update by product ID
router.put('/product/:productId',authenticate.storeStaffAuthenticate,productControllers.updateProductById)
//DELETE /api/products/:productId----- delete product by product Id
router.delete('/product/:productId', authenticate.storeStaffAuthenticate,productControllers.deleteProductById)

//....................GET ..... api.........................

//GET /products/ fetching all prodects 
router.get('/product',productControllers.getAllProducts)
//GET /products/category/:categoryId fetching all products by category
router.get('/product/categoryId/:categoryId',productControllers.getAllProductsByCategory)
// GET /products/:productId fetching product by product id
router.get('/product/productId/:productId',productControllers.getProductById)


module.exports = router
