
module.exports = {
  baseUrl: '/niem-mapping-app/',
  assetsDir: 'src/assets',
  devServer: {
    watchOptions: {
      poll: true
    }
  },
  configureWebpack: {
    devtool: 'source-map'
  }
}