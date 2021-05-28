const { check,validationResult } = require('express-validator');

module.exports = {

    validateSignup: () => {
        return ([
            check('first_name', 'First name is required.').notEmpty(),
            check('last_name', 'Last name is required.').notEmpty(),
            check('email', 'Email is required.').notEmpty().isEmail(),
            check('password', 'Password is required.').notEmpty(),
            check('mobile', 'Mobile no. is required.').notEmpty()
        ])
    },

    validateLogin: ()=> {
        return ([
            check('email', 'Email is required.').notEmpty().isEmail(),
            check('password', 'Password is required.').notEmpty(),
        ])
    },

    validateProduct: ()=>{
        return ([
            check('name', 'Product name is required.').notEmpty(),
            check('description', 'Description is required.').notEmpty(),
            check('available_stock', 'Available stock is required.').notEmpty()
        ])
    },

    validate: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.errors[0].msg });
        }
        next()
    }
}