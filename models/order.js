const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema
const connection = require('../db/connection')

var schema = new Schema({

    order_id:{
        type: String
    },
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
        }
    }],
    cart_total_item:{
        type: Number
    },
    total_amount:{
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
    collection: 'order'
})

schema.pre('save', function (next) {
    var order = this
    order.created_at = order.updated_at = moment().unix() * 1000
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