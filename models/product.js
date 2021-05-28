const mongoose = require('mongoose');
const moment = require('moment');
const Encrypt = require('../utils/encrypt')

const Schema = mongoose.Schema
const connection = require('../db/connection')

var schema = new Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    price: {
        type: String
    },
    image: {
        type: String
    },
    available_stock: {
        type: Number
    },
    is_fast_deliverable: {
        type: Boolean,
        default: false
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
    collection: 'product'
})

schema.pre('save', function (next) {
    var product = this
    product.created_at = product.updated_at = moment().unix() * 1000
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