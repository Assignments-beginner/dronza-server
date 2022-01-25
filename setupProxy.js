const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    proxy("/create-payment-intent", {
      target: "https://morning-badlands-81993.herokuapp.com",
      secure: false,
      changeOrigin: true
    })
  );