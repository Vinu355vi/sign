const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/sign-kit/videos',
    createProxyMiddleware({
      target: 'https://sign-kit-api.herokuapp.com',
      changeOrigin: true,
      pathRewrite: {
        '^/sign-kit/videos': '/videos',
      },
    })
  );
};
