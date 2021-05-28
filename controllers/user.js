const User = require('../models/user')
const {decrypt}= require('../utils/encrypt')
var jwt = require('jsonwebtoken');
const config= require('../config')

module.exports = {

    signup: async (req, res) => {
        try {
            let oldUser= await User.findOne({ email: req.body.email})
            if(oldUser){
                throw { message: 'User already exist.'}
            }
            let user = new User(req.body)
            let result = await user.save();
            res.json({
                status: 'success',
                message: 'User created successfully.',
                data: result
            })

        } catch (error) {
           res.status(400).json({
               message: (error && error.message) || 'Oops! Failed to create user.'
           })
        }
    },

    login: async (req,res)=>{
        try {
            let user= await User.findOne({email: req.body.email})
            if(!user){
                return res.status(400).json({
                    message: 'Please check your email or password.'
                })
            } else{
                let result= decrypt(req.body.password,user.password)
                if(result){
                    let jwtData = {
                        _id: user._id,
                        email: user.email
                      }
                    token = jwt.sign(jwtData,config.secret , {
                        expiresIn: 60 * 60 * 24 
                      })
                    let userObj= {
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.last_name,
                        token: token
                    }
                    res.json({
                        status: 'success',
                        message: 'Looged in successfully.',
                        data: userObj
                    })
                } else{
                    return res.status(400).json({
                        message: 'Please check your email or password.'
                    })
                }
            }
            
        } catch (error) {
            res.status(400).json({
               message: (error && error.message) || 'Oops! Failed to login.' 
            })
        }
    }
}