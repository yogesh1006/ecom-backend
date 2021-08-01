const Cart = require('../models/cart')
const Product = require('../models/product')
const config =require('../config')



module.exports = {

    addToCart: async (req, res) => {
        try {
            if (!req.body.product_id) {
                throw { message: 'Product id is required.' }
            }
            let product = await Product.findById(req.body.product_id)
            let cart = await Cart.findOne({ user_id: req.user._id })
            if (cart) {
                cart.products.map(item => {
                    if (item.product_id == req.body.product_id) {
                        throw { message: 'Product already exist in cart.' }
                    }
                })
                cart.products.push({
                    product_id: product._id,
                    name: product.name,
                    qty: 1,
                    price: product.price,
                    image: product.image
                })
                let cart_total_price= 0;
                cart.products.map(item => {
                    cart_total_price= cart_total_price + (parseInt(item.price) * parseInt(item.qty))
                })
                let cart_total_item = cart.products.length
                let updatedCart = await Cart.findByIdAndUpdate(
                    cart._id,
                    { products: cart.products, cart_total_item: cart_total_item,cart_total_price:cart_total_price },
                    { new: true }
                )
                res.json({
                    status: 'success',
                    message: 'Product added to cart.'
                })
            } else {
                let products = [{
                    product_id: product._id,
                    name: product.name,
                    price: product.price,
                    image: product.image
                }]
                let cart_total_price= 0;
                products.map(item => {
                    cart_total_price= cart_total_price + (parseInt(item.price) * parseInt(item.qty))
                })
                let newCart = new Cart({
                    user_id: req.user._id,
                    products: products,
                    cart_total_item: 1,
                    cart_total_price:cart_total_price
                })

                let result = await newCart.save()
                res.json({
                    status: 'success',
                    message: 'Product added to cart.'
                })
            }



        } catch (error) {
            res.status(400).json({
                message: (error && error.message) || 'Oops! Failed to add product.'
            })
        }
    },

    updatedCartQty: async (req, res) => {
        try {
            if (!req.body.product_id || !req.body.qty) {
                throw { message: 'Product id and qty is required.' }
            }
            let cart = await Cart.findOne({ user_id: req.user._id })
            cart.products.map(item => {
                if (item.product_id == req.body.product_id) {
                    item.qty = req.body.qty
                }
            })
            let cart_total_price= 0;
                cart.products.map(item => {
                    cart_total_price= cart_total_price + (parseInt(item.price) * parseInt(item.qty))
                })
            let updatedCart = await Cart.findByIdAndUpdate(
                cart._id,
                { products: cart.products ,cart_total_price:cart_total_price},

                { new: true }
            )

            res.json({
                status: 'success',
                message: 'Product quantity updated successfully.'
            })

        } catch (error) {
            res.status(400).json({
                message: (error && error.message) || 'Oops! Failed to update quantity.'
            })
        }
    },

    removeProduct: async (req, res) => {
        try {
            if (!req.body.product_id) {
                throw { message: 'Product id is required.' }
            }
            let cart = await Cart.findOne({ user_id: req.user._id })
            let products = cart.products.filter(item => item.product_id != req.body.product_id)
            let cart_total_price= 0;
                products.map(item => {
                    cart_total_price= cart_total_price + (parseInt(item.price) * parseInt(item.qty))
                })
            let result = await Cart.findByIdAndUpdate(cart._id, { products: products, cart_total_item: products.length,cart_total_price:cart_total_price }, { new: true })
            res.json({
                status: 'success',
                message: 'Product removed from the cart.'
            })
        } catch (error) {
            res.status(400).json({
                message: (error && error.message) || 'Oops! Failed to remove product.'
            })
        }
    },

    emptyCart: async (req, res) => {
        try {
            
            let result = await Cart.findOneAndUpdate({ user_id:req.user._id }, { products: [], cart_total_item: 0 ,cart_total_price:0 }, { new: true })
            res.json({
                status: 'success',
                message: 'Cart emptied successfully.'
            })
        } catch (error) {
            res.status(400).json({
                message: (error && error.message) || 'Oops! Failed empty cart.'
            })
        }
    },

    getUserCart: async (req, res) => {
        try {
            let cart = await Cart.findOne({ user_id:req.user._id })
            cart.products.map(items =>{
                items.image=config.imageUrl + "product/" + items.image
            })
            res.json({
                status: 'success',
                message: 'User cart',
                data: cart
          })
        } catch (error) {
            res.status(400).json({
                message: (error && error.message) || 'Oops! Failed to get user cart.'
            })
        }
    }
}