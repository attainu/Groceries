
const Product = require('../models/Product')


module.exports = {

	createProduct: async (req, res) => {
        const categoryId  = req.params.categoryId
       
        if (!categoryId)return res.status(400).json({ statusCode: 400, message: 'Invalid Category Id' })
        
		try {
            const productName=await Product.findOne({ name: req.body.name })
		    if (productName)return res.status(400).json({ statusCode: 400, message: 'Product already exist' })
			const product = await Product.create(req.body)
            product.storeStaff = req.storeStaff._id
            product.category = categoryId
			productJson = await product.populate('storeStaff', ['name']).populate('category', ['name']).execPopulate()
			res.status(201).json({ statusCode: 201, productJson })
		} catch (err) {
			if (err.name === 'CastError')
				return res.status(400).send({ statusCode: 400, message: 'Invalid Product Id' })
			res.status(500).send({ statusCode: 500, message: 'Server Error' })
		}
	},
    

    updateProductById: async (req, res) => {
        const  productId  = req.params.productId
        console.log(productId)
		if (!productId)return res.status(400).send({ statusCode: 400, message: 'Product Id not found' })
		try {
            
            console.log(req.body)
			const product = await Product.findOneAndUpdate(
				{_id: productId },
				{ $set: req.body },
				{ new: true }
            )
           product.storeStaff=req.storeStaff._id
         console.log(product)
         if (!product)return res.status(400).send({ statusCode: 400, message: 'Product not found' })
		const productShown = await product.populate("storeStaff",['name']).populate("category", ['name']).execPopulate()
          console.log(productShown)    
        return res.status(202).json({ statusCode: 202, productShown })
		} catch (err) {
	
			res.status(500).send({ statusCode: 500, message: 'Server Error' })
		}
	},

	
	deleteProductById: async (req, res) => {
		constproductId = req.params.productId
		if (!productId)
			return res.status(400).send({ statusCode: 400, message: 'Product Id not found' })
		try {
			const product = await Product.findByIdAndDelete(productId).populate('user', ['name']).populate('category', ['name'])
			if (!product)return res.status(404).send({ statusCode: 404, message: 'Product not found' })
		} catch (err) {
			(err.message)
			if (err.name === 'CastError')return res.status(400).send({ statusCode: 400, message: 'Invalid Product Id' })
			res.status(500).send({ statusCode: 500, message: 'Server Error' })
		}
	},

	getAllProducts: async (req, res) => {
		
		try {
			const products = await Product.find({}).populate('category', ['name']).sort('-createdAt')
			res.json({ statusCode: 200, count: products.length, products })
		} catch (err) {
			(err.message)
			res.status(500).send({ statusCode: 500, message: 'Server Error' })
		}
	},

	getAllProductsByCategory: async (req, res) => {
		const categoryId  = req.params.categoryId
		if (!categoryId)return res.status(400).send({ statusCode: 400, message: 'Category Id not found' })
		try {
			const products = await Product.find({ category: categoryId }).populate('storeStaff', ['name']).populate('category',['name'])
			if (!products)
				return res
					.status(404)
					.send({ statusCode: 404, message: 'No products found' })
			res.send({ statusCode: 200, products })
		} catch (err) {
			if (err.name === 'CastError')
				return res
					.status(400)
					.send({ statusCode: 400, message: 'Invalid Category Id' })
			res.status(500).send({ statusCode: 500, message: 'Server Error' })
		}
	},


	getProductById: async (req, res) => {
		const productId  = req.params.productId
		if (!productId)return res.status(400).send({ statusCode: 400, message: 'Product Id not found' })
		try {
			const product = await Product.findById(productId).populate('storeStaff', ['name']).populate('category', ['name'])
			if (!product)return res.status(404).send({ statusCode: 404, message: 'Product not found' })
			res.json({ statusCode: 200, product })
		} catch (err) {
			if (err.name === 'CastError')return res.status(400).send({ statusCode: 400, message: 'Invalid Product Id' })
			res.status(500).send({ statusCode: 500, message: 'Server Error' })
		}
	},



}
