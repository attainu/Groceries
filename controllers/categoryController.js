const Category = require('../models/Category')
module.exports = {
  
  allCategories: async (req, res) => {
    try {
      const categories = await Category.find({},'name')
      if (!categories.length) return res.status(404).json({ statusCode: 404, message: 'No categories present' })
        const categoriesArr=[];
      for(let i=0;i<categories.length;i++){
           categoriesArr.push(categories[i].name)
         }
      res.json({ statusCode: 200, categories:categoriesArr })
    } catch (err) {
      res.status(500).send({ statusCode: 500, message: 'Server Error' })
    }
  },

  createCategory: async (req, res) => {
    const categoryName=req.body.name
    try {
      let category = await Category.findOne({ name:categoryName })
      if (category) {
        return res.status(400).json({ statusCode: 400, message: 'Category already exists' })
      }
      else {
        category = await Category.create(req.body)
      } 
      res.status(201).json({ statusCode: 201, category })
    } catch (err) {
      res.status(500).send({ statusCode: 500, message: 'Server Error' })
    }
  },

  categoryById: async (req, res) => {
    const  categoryId = req.params.categoryId
    try {
      if (!categoryId) return res.status(400).send({ statusCode: 400, message: 'Category Id not given' })
      const category = await Category.findById(categoryId)
      if (!category) return res.status(404).send({ statusCode: 404, message: 'Category not found' })
      res.json({ statusCode: 200, category })
    } catch (err) {
      res.status(500).send({ statusCode: 500, message: 'Server Error' })
    }
  },

  updateCategoryById: async (req, res) => {
    const  categoryId = req.params.categoryId
    try {
      if (!categoryId) return res.status(400).send({ statusCode: 400, message: 'Category Id not given' })
      const category = await Category.findByIdAndUpdate(categoryId, { $set: req.body }, { new: true })
      if (!category) return res.status(404).send({ statusCode: 404, message: 'Category not found' })
      res.send({ statusCode: 200, category })
    } catch (err) {
      res.status(500).send({ statusCode: 500, message: 'Server Error' })
    }
  },
  
  deleteCategoryById: async (req, res) => {
    const  categoryId = req.params.categoryId
    try {
      if (!categoryId) return res.status(400).send({ statusCode: 400, message: 'Category Id not given' })
      const category = await Category.findByIdAndDelete(categoryId)
      if (!category) return res.status(404).send({ statusCode: 404, message: 'Category not found' })
      res.json({ statusCode: 200, category })
    }catch (err) {
      res.status(500).send({ statusCode: 500, message: 'Server Error' })
    }
  }

}