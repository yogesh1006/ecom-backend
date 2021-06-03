const config= require('../config')
const mongoose= require('mongoose') 

let connection
connection = mongoose.createConnection(config.dbUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }) // database name
connection.on('error', (err) => console.error(err))

module.exports = connection
