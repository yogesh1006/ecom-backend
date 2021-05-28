const express = require('express');
const router = express.Router();
const UserController= require('../controllers/user')
const AdminController= require('../controllers/admin')
const CartController= require('../controllers/cart')
const ProductController= require('../controllers/product')
const OrderController= require('../controllers/order')
const WishlistController= require('../controllers/wishlist')
const Validation= require('../validations')
const {upload}= require('../utils/uploader')
const isUserAuthenticated= require('../middlewares/isUserAuthenticated')


// User apis

router.post('/auth/login',Validation.validateLogin(),Validation.validate,UserController.login)
router.post('/auth/signup',Validation.validateSignup(),Validation.validate,UserController.signup)

router.all('/api/*', isUserAuthenticated)

//Admin apis

router.post('/auth/add_product',upload.single('product'),Validation.validateProduct(),Validation.validate,AdminController.addProduct)
router.put('/auth/edit_product',upload.single('product'),AdminController.editProduct)
router.post('/auth/delete_product',AdminController.deleteProduct)

// Cart apis

router.post('/api/add_to_cart',CartController.addToCart)
router.put('/api/update_cart_qty',CartController.updatedCartQty)
router.post('/api/remove_product',CartController.removeProduct)
router.post('/api/empty_cart',CartController.emptyCart)
router.get('/api/get_user_cart',CartController.getUserCart)

// Product apis

router.post('/auth/get_all_products',ProductController.getAllProducts)
router.post('/auth/get_product',ProductController.getProduct)

// Order apis

router.post('/api/place_order',OrderController.placeOrder)
router.get('/api/get_all_order',OrderController.getAllorder)
router.post('/api/get_order_detail',OrderController.getOrderDetail)


//  Wishlist apis

router.post('/api/add_to_wishlist',WishlistController.addToWishlist)
router.post('/api/remove_product_wishlist',WishlistController.removeProduct)
router.get('/api/get_user_wishlist',WishlistController.getUserWishlist)
router.post('/api/add_cart',WishlistController.addToCart)


module.exports = router;
