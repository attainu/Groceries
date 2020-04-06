const express = require('express')
const authenticate = require('../middleware/authenticate')
var router = express.Router();
const categoryController = require('../controllers/categoryController')

router.get('/category',categoryController.allCategories)

router.post('/category',authenticate.storeStaffAuthenticate, categoryController.createCategory)

router.get('/category/:categoryId', categoryController.categoryById)

router.put('/category/:categoryId',authenticate.storeStaffAuthenticate,categoryController.updateCategoryById)

router.delete('/category/:categoryId', authenticate.storeStaffAuthenticate,categoryController.deleteCategoryById)

module.exports = router