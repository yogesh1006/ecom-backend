const Order = require('../models/order')
const Cart = require('../models/cart')
const uniqid = require('uniqid');




module.exports = {

    placeOrder: async (req, res) => {
        try {
            let cart = await Cart.findOne({ user_id: req.user._id })
            let total_amount = 0;
            cart.products.map(item => {
                total_amount += (item.qty * item.price)
            })
            let order = new Order({
                order_id: uniqid(),
                user_id: req.user._id,
                products: cart.products,
                cart_total_item: cart.cart_total_item,
                total_amount: total_amount
            })
            let new_order = await order.save()
            if (new_order) {
                let emptyCart = await Cart.findByIdAndUpdate(cart._id, { products: [], cart_total_item: 0 }, { new: true })
                res.json({
                    status: 'success',
                    message: 'Order placed successfully.',
                    data: new_order
                })
            }
        } catch (error) {
            res.status(400).json({
                message: (error && error.message) || 'Oops! Failed to place order.'
            })
        }
    },

    getAllorder: async (req, res) => {
        try {
            let orders = await Order.find().sort({ created_at: -1 })
            let orderList = orders.map(ord => {
                return ({
                    order_id: ord.order_id,
                    created_at: ord.created_at
                })
            })
            res.json({
                status: 'success',
                message: 'Order list.',
                data: orderList
            })
        } catch (error) {
            res.status(400).json({
                message: (error && error.message) || 'Oops! Failed to get order list.'
            })
        }
    },

    getOrderDetail: async (req,res)=>{
        try {
            if(!req.body.order_id){
               throw { message: 'Order id is required.'} 
            }
            let order= await Order.findOne({ order_id: req.body.order_id})
            res.json({
                status: 'success',
                message: 'Order detail.',
                data: order
            })
        } catch (error) {
            res.status(400).json({
                message: (error && error.message) || 'Oops! Failed to get order detail.'
            })
        }
    }
}