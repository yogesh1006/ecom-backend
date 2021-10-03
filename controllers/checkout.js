const config = require("../config");
const User = require("../models/user");
const stripe = require("stripe")(config.stripeKey);
const { v4: uuidv4 } = require('uuid');


module.exports = {
  checkout: async (req, res) => {
    try {
      let user = await User.findById(req.user._id);

      if (user.stripe_id) {
        let charge = await stripe.charges.create(
          {
            amount: parseInt(req.body.amount) * 100,
            currency: "INR",
            customer: user.stripe_id,
            shipping: {
              name: user.first_name + " " + user.last_name,
              address: {
                country: req.body.token.card.country,
              },
            },
          },
          { idempotencyKey: uuidv4() }
        );
        if(charge){
            return res.json({
                status:"success",
                message:"payment success",
                data:charge
            })
        }
      } else {
        const customer = await stripe.customers.create({
          email: user.email,
          source: req.body.token.id,
        });
        if (customer) {
          let charge = await stripe.charges.create(
            {
              amount: parseInt(req.body.amount) * 100,
              currency: "INR",
              customer: customer.id,
              shipping: {
                name: user.first_name + " " + user.last_name,
                address: {
                  country: req.body.token.card.country,
                },
              },
            },
            { idempotencyKey: uuidv4() }
          );
          if(charge){
              return res.json({
                  status:"success",
                  message:"payment success",
                  data:charge
              })
          }
        }
      }
    } catch (error) {
       return  res.status(400).json({
            message: (error && error.message) || 'Oops! Payment Failed.'
        }) 
    }
  },
};
