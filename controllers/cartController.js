const Product = require('../models/Product')
const Cart=require('../models/Cart')

module.exports = {

	createCart: async (req, res) => {
        const productId=req.params.productId
        console.log(productId,"hhh")
        if (!productId)return res.status(400).json({ statusCode: 400, message: 'Invalid product Id' })
		try {
            const product = await Product.findById(productId)
            console.log(product)
            const productPrice=product.price* req.body.quantity
            const cart= await Cart.findOne({owner:req.customer._id}) 
            console.log(cart)
		    if (cart){
                cart.items.push({
                    item: productId,
                    price: parseFloat(productPrice),
                    quantity: parseInt(req.body.quantity)       
            })
            cart.total = (cart.total + parseFloat(productPrice)).toFixed(2);
            await cart.save();
            res.status(201).json({ statusCode: 201, cart })
        }else{
            const owner=req.customer._id
            
            const newCart = new Cart({
                owner:owner
            })
           
            newCart.items.push({
                item: productId,
                price: parseFloat(productPrice),
                quantity: parseInt(req.body.quantity)
        })
        
            newCart.total = (newCart.total + parseFloat(productPrice)).toFixed(2);
            console.log(newCart)
          await newCart.save();
          res.status(201).json({ statusCode: 201, newCart })
    }	
			
        } 
        catch (err) {
			if (err.name === 'CastError')
				return res.status(400).send({ statusCode: 400, message: 'Invalid Product Id' })
			res.status(500).send({ statusCode: 500, message: 'Server Error' })
		}
    },
    getCart: async (req, res) => {
          const owner =req.customer._id
       
        if (!owner)return res.status(400).json({ statusCode: 400, message: 'Invalid owner Id' })
		try {
           
            const cart= await Cart.findOne({owner:owner})
            if (!cart)return res.status(400).json({ statusCode: 400, message: 'Invalid cart Id' })
            console.log(cart)
            cartJson = await cart.populate('customer', ['name']).execPopulate()
            res.status(201).json({ statusCode: 201, cartJson })	
        } 
        catch (err) {
			if (err.name === 'CastError')
				return res.status(400).send({ statusCode: 400, message: 'Invalid Product Id' })
			res.status(500).send({ statusCode: 500, message: 'Server Error' })
		}
    },
    removeCartItem: async (req, res) => {
        const productId=req.params.productId
       // console.log(productId,"pp")
        const owner=req.customer._id
        if (!productId)return res.status(400).json({ statusCode: 400, message: 'Invalid product Id' })
		try {
            const product = await Product.findById(productId)
           // console.log(product)
        const cart= await   Cart.findOneAndUpdate({owner:owner},{$pull:{items:{item:productId}}},{new:true})
        // console.log(cart)
         cart.total = (cart.total - parseFloat(product.price)).toFixed(2); 
            await cart.save();
            res.status(201).json({ statusCode: 201, cart })
      
    }	
        catch (err) {
			if (err.name === 'CastError')
				return res.status(400).send({ statusCode: 400, message: 'Invalid Product Id' })
			res.status(500).send({ statusCode: 500, message: 'Server Error' })
		}
    },
    
    removeCart: async (req, res) => {
        //const productId=req.params.productId
       // console.log(productId,"pp")
        const owner=req.customer._id
        if (!owner)return res.status(400).json({ statusCode: 400, message: 'Invalid owner Id' })
		try {
           // const product = await Product.findById(productId)
           console.log(owner)
        const cart= await   Cart.findOne({owner:owner})
        // console.log(cart)
        cart.items=[];
         cart.total = 0;
            await cart.save();
            res.status(201).json({ statusCode: 201, cart,message:"your cart is empty" })
      
    }	
        catch (err) {
			if (err.name === 'CastError')
				return res.status(400).send({ statusCode: 400, message: 'Invalid Product Id' })
			res.status(500).send({ statusCode: 500, message: 'Server Error' })
		}
    },



}
