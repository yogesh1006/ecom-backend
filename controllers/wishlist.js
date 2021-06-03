const Cart = require('../models/cart')
const Product = require('../models/product')
const Wishlist = require('../models/wishlist')
const config =require('../config')


module.exports = {

    addToWishlist: async (req, res) => {
        try {
            if (!req.body.product_id) {
                throw { message: 'Product id is required.' }
            }
            let cart= await Cart.findOne( {user_id: req.user._id })

            if(cart){
                if(cart.products.length){
                    cart.products.map(item=>{
                        if (item.product_id == req.body.product_id) {
                            throw { message: 'Product already exist in cart.' }
                        }
                    })
                }
            }
            let product = await Product.findById(req.body.product_id)
            let wishlist = await Wishlist.findOne({ user_id: req.user._id })
            if (wishlist) {
                wishlist.products.map(item => {
                    if (item.product_id == req.body.product_id) {
                        throw { message: 'Product already exist in wishlist.' }
                    }
                })
                wishlist.products.push({
                    product_id: product._id,
                    name: product.name,
                    qty: 1,
                    price: product.price,
                    image: product.image
                })
                let wishlist_total_item = wishlist.products.length
                let updatedWishlist = await Wishlist.findByIdAndUpdate(
                    wishlist._id,
                    { products: wishlist.products, wishlist_total_item: wishlist_total_item },
                    { new: true }
                )
                res.json({
                    status: 'success',
                    message: 'Product added to wishlist.'
                })
            } else {
                let products = [{
                    product_id: product._id,
                    name: product.name,
                    price: product.price,
                    image: product.image
                }]
                let newWishlist = new Wishlist({
                    user_id: req.user._id,
                    products: products,
                    wishlist_total_item: 1
                })

                let result = await newWishlist.save()
                res.json({
                    status: 'success',
                    message: 'Product added to wishlist.'
                })
            }



        } catch (error) {
            res.status(400).json({
                message: (error && error.message) || 'Oops! Failed to add product.'
            })
        }
    },

    

    removeProduct: async (req, res) => {
        try {
            if (!req.body.product_id) {
                throw { message: 'Product id is required.' }
            }
            let wishlist = await Wishlist.findOne({ user_id: req.user._id })
            let products = wishlist.products.filter(item => item.product_id != req.body.product_id)
            let result = await Wishlist.findByIdAndUpdate(wishlist._id, { products: products, wishlist_total_item: products.length }, { new: true })
            res.json({
                status: 'success',
                message: 'Product removed from the wishlist.'
            })
        } catch (error) {
            res.status(400).json({
                message: (error && error.message) || 'Oops! Failed to remove product.'
            })
        }
    },



    getUserWishlist: async (req, res) => {

        try {

            let wishlist = await Wishlist.findOne({ user_id:req.user._id })
            wishlist.products.map(item =>{
                item.image=config.imageUrl +'product/'+ item.image 
            })
            res.json({
                status: 'success',
                message: 'User wishlist.',
                data: wishlist
          })
        } catch (error) {
            res.status(400).json({
                message: (error && error.message) || 'Oops! Failed to get user wishlist.'
            })
        }
    },

    addToCart : async (req,res)=>{
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
                    price: product.price
                })
                let cart_total_item = cart.products.length
                let updatedCart = await Cart.findByIdAndUpdate(
                    cart._id,
                    { products: cart.products, cart_total_item: cart_total_item },
                    { new: true }
                )
                let wishlist = await Wishlist.findOne({ user_id: req.user._id })
                let wishlistProducts = wishlist.products.filter(item => item.product_id != req.body.product_id)
                let updatedWishlist = await Wishlist.findByIdAndUpdate(wishlist._id, { products: wishlistProducts, wishlist_total_item: wishlistProducts.length }, { new: true })
            
               
                res.json({
                    status: 'success',
                    message: 'Product added to cart.'
                })
            } else {

                let products = [{
                    product_id: product._id,
                    name: product.name,
                    price: product.price,
                }]
                let newCart = new Cart({
                    user_id: req.user._id,
                    products: products,
                    cart_total_item: 1
                })

                let result = await newCart.save()
                if(result){
                    let wishlist = await Wishlist.findOne({ user_id: req.user._id })
                let wishlistProducts = wishlist.products.filter(item => item.product_id != req.body.product_id)
                let updatedWishlist = await Wishlist.findByIdAndUpdate(wishlist._id, { products: wishlistProducts, wishlist_total_item: wishlistProducts.length }, { new: true })
            
                }
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
    } 
}