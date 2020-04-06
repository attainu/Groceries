
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Customer = require("../models/Customer");

module.exports = {
  createOrder: async (req, res) => {
    const customerId =req.customer
    const { invoiceAddress ,method} = req.body;
    console.log(invoiceAddress)
    try {
      const cart = await Cart.findOne({owner:customerId});
      if (!cart)
        return res
          .status(404)
          .send({ statusCode: 404, message: "Cart not found" });
         // const cart=await cart1.populate('items.item').execPopulate();
       const cartId= cart._id
       customer = await Customer.findById(customerId);
console.log(cart.items)
      if (!customer)
        return res
          .status(404)
          .send({ statusCode: 404, message: "customer not found" });
      const productsSubTotal = cart.total
      console.log(cart.coupon.type)
      const totalAmount =
        productsSubTotal -
        (cart.coupon.value !== undefined
          ? cart.coupon.type == "percentage"
            ? Math.round(productsSubTotal * (parseInt(cart.coupon.value) / 100))
            : parseInt(cart.coupon.value)
          : 0);
          console.log(totalAmount)
      const orderObj = {
        coupon: cart.coupon.code !== undefined ? cart.coupon.code : "nil",
        cart: cartId,
        user: customerId,
        products: cart.items,
        method,
        totalAmount,
        invoiceAddress,
        expiryDate: new Date().setHours(new Date().getHours() + 48)
      };
      console.log(orderObj)
        order = await Order.create(orderObj);
       await Cart.findByIdAndDelete(order.cart)
        res.status(201).send({ statusCode: 201, orderId: order._id });
      
    } catch (err) {
      res.status(500).send({ statusCode: 500, message: "Server Error" });
    }
  },

  changePaymentMethod: async (req, res) => {
    const { orderId } = req.params;
    try {
      if (!orderId)return res.status(400).send({ statusCode: 400, message: "Order Id not found" });
      const method  = req.body.method;
      const order = await Order.findById(orderId);
      order.method = method;
      await order.save();
      res.status(202).send({ statusCode: 202, order });
    } catch (err) {
      res.status(500).send({ statusCode: 500, message: "Server Error" });
    }
  },
  changePaymentStatus: async (req, res) => {
    const { orderId } = req.params;
    try {
      if (!orderId)return res.status(400).send({ statusCode: 400, message: "Order Id not found" });
      const paymentStatus  = req.body.paymentStatus;
      const order = await Order.findById(orderId);
      order.paymentStatus = paymentStatus;
      await order.save();
      res.status(202).send({ statusCode: 202, order });
    } catch (err) {
      res.status(500).send({ statusCode: 500, message: "Server Error" });
    }
  },
  changeOrderStatus: async (req, res) => {
    const { orderId } = req.params;
    try {
      if (!orderId)return res.status(400).send({ statusCode: 400, message: "Order Id not found" });
      const orderStatus  = req.body.orderStatus;
      const order = await Order.findById(orderId);
      order.orderStatus = orderStatus;
      
      if(order.method==="cash"&&order.orderStatus==="delivered"){
       order.paymentStatus="success"
       await order.save();
       res.status(202).send({ statusCode: 202, order,message:`your order is${orderStatus}, thank you for shopping with us` })
      }
      else{
      await order.save();
      res.status(202).send({ statusCode: 202, order,message:`your order is${orderStatus}` });
      }
    } catch (err) {
      res.status(500).send({ statusCode: 500, message: "Server Error" });
    }
  },
 

  async fetchOrderById(req, res) {
    const orderId  = req.params.orderId;
    if (!orderId)return res.status(400).send({ statusCode: 400, message: "Order Id is invaild" });
    try {
      const order = await Order.findById(orderId);
      if (!order)return re.status(404).send({ statusCode: 404, message: "Order not found" });
      res.send({ statusCode: 200, order });
    } catch (err) {
      if (err.name === "CastError")
        return res
          .status(404)
          .send({ statusCode: 400, message: "Invalid Order Id" });
    }
  },

  customerOrderHistory: async (req, res) => {
    const customer = req.customer;
    try {
      const orders = await Order.find({ user: customer._id, status: "Success" });
      res.send({ statusCode: 200, orders });
    } catch (err) {
      res.status(500).send({ statusCode: 500, message: "Server Error" });
    }
  },

  cancelOrderById: async (req, res) => {
    const { orderId } = req.params;
    if (!orderId)
      return res.status(400).send({ statusCode: 400, message: "Order ID not found" });
    try {
      const order = await Order.findById(orderId);
      if (!order) return res.status(404).send({ statusCode: 404, message: "Order not found" });
      if( order.orderStatus==="delivered"&&order.orderStatus==="outForDelivery")
     { res.status(202).send({ statusCode: 202, order,message:"order can not be cancelled" });
    }if(order.paymentStatus==="success"){
        order.remove();
      return res.status(202).send({ statusCode: 202, message: "we refund your money in 48h" });
    }
    order.remove();
    res.status(202).send({ statusCode: 202, order,message:"order is cancelled" })
    } catch (err) {
      res.status(500).send({ statusCode: 500, message: "Server Error" });
    }
  }
};
