const Product= require('../models/product')
const config= require('../config')

module.exports={

    getAllProducts: async (req,res)=>{
        try {
            let search={}
            if(req.body.search){
              search={ "name": { "$regex": req.body.search, "$options": "i" }}
            }
            let sort={};
            if(req.body.order){
                sort[req.body.column]= parseInt(req.body.order)
            } else{
                sort= { price: 1 }
            }

            let product= await Product.find(search).sort(sort)
            product.map(item=>{
                item.image= config.imageUrl +'product/'+ item.image 
            })
            res.json({
                status: 'success',
                message: 'Product list.',
                data: product
            })

        } catch (error) {
            res.status(400).json({
                message: (error && error.message) || 'Oops! Failed to get products.'
            })
        }
    },

    getProduct: async (req,res)=>{
        try {
          let product = await Product.findById(req.body.product_id) 
          product.image= config.imageUrl +'product/'+ product.image 
          res.json({
            status: 'success',
            message: 'Product detail.',
            data: product
        }) 
        } catch (error) {
            res.status(400).json({
                message: (error && error.message) || 'Oops! Failed to get product.'
            })
        }
    }
}