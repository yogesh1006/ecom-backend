require('dotenv').config()

module.exports={
    dbUrl: process.env.DB_URL,
    imageUrl: process.env.IMAGE_URL,
    secret: process.env.SECRET,
    stripeKey:process.env.CHECKOUT_BACKEND
}