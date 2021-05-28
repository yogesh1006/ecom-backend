const Product = require('../models/product')
const path = require('path')
const { remove } = require('../utils/uploader')


module.exports = {

    addProduct: async (req, res) => {
       try {
            req.body.image = req.file.filename
            let product = new Product(req.body)
            let result = await product.save()
            res.json({
                status: 'success',
                message: 'Product added successfully.',
                data: result
            })
        } catch (error) {
            res.status(400).json({
                message: (error && error.message) || 'Oops! Failed to add product.'
            })
        }
    },

    editProduct: async (req, res) => {

        try {
            if(!req.body.product_id){
                return res.status(400).json({
                    message: 'Product id is required.'
                })
            }
            let product = await Product.findById(req.body.product_id)
            if (req.file) {
                let dest = path.join(__dirname + '/../' + 'uploads/product/' + product.image)
                remove(dest)
            }
            let result = await Product.findByIdAndUpdate(req.body.product_id, {
                name: req.body.name ? req.body.name : product.name,
                description: req.body.description ? req.body.description : product.description,
                price: req.body.price ? req.body.price : product.price,
                available_stock: req.body.available_stock ? req.body.available_stock : product.available_stock,
                is_fast_deliverable: req.body.is_fast_deliverable ? req.body.is_fast_deliverable : product.is_fast_deliverable,
                image: req.file ? req.file.filename : product.image
            }, {new : true})

            res.json({
                status: 'success',
                message: 'Product edited successfully.',
                data: result
            })
        } catch (error) {
            return res.status(400).json({
                message: (error && error.message) || 'Oops! Failed to update product.'
            })
        }
    },

    deleteProduct: async (req,res)=>{
        try {
            if(!req.body.product_id){
              throw  { message: 'Product id is required.' }
            }
            let product= await Product.findById(req.body.product_id)
            if(product){
                let dest = path.join(__dirname + '/../' + 'uploads/product/' + product.image)
                remove(dest)
                let result= await Product.findByIdAndDelete(req.body.product_id)
                res.json({
                    status: 'success',
                    message: 'Product deleted successfully.'
                })
            } else{
                throw { message:"Product with these id doesn't exist" }
            }
            

        } catch (error) {
            console.log(error)
            res.status(400).json({
                message: (error && error.message)
            })
        }
    }
}