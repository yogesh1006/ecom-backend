const mongoose = require('mongoose');
const moment = require('moment');
const Encrypt = require('../utils/encrypt')

const Schema = mongoose.Schema
const connection = require('../db/connection')

var schema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId
    },
    products: [{
        product_id: {
            type: Schema.Types.ObjectId
        },
        name: {
            type: String
        },
        qty: {
            type: Number,
            default: 1
        },
        price: {
            type: Number
        },
        image:{
        type:String
        }
    }],
    wishlist_total_item:{
        type: Number
    },
    updated_at: {
        type: Date,
        default: moment().unix() * 1000
    },
    created_at: {
        type: Date,
        default: moment().unix() * 1000
    }
}, {
    collection: 'wishlist'
})

schema.pre('save', function (next) {
    var wishlist = this
    wishlist.created_at = wishlist.updated_at = moment().unix() * 1000
    next()
})

schema.pre('update', function (next) {
    this.update({}, {
        $set: {
            updated_at: moment().unix() * 1000
        }
    })
    next()
})


module.exports = connection.model(schema.options.collection, schema)