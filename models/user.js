const mongoose= require('mongoose');
const moment= require('moment');
const { encrypt }= require('../utils/encrypt')

const Schema = mongoose.Schema
const connection = require('../db/connection')

var schema = new Schema({
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    email:{
        type : String
    },
    password:{
        type: String
    },
    mobile: {
        type : String
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
    collection: 'user'
})

schema.pre('save', function (next) {
    var user = this
    user.password= encrypt(user.password)
    user.created_at = user.updated_at = moment().unix() * 1000
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