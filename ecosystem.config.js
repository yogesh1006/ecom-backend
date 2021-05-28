module.exports = {
    apps : [{
      name        : "ecommerece",
      script      : "./bin/www",
      watch       : true,
      env: {
        "PORT":3000,
        "HOST":"13.235.242.157"
      }
    }]
  }
