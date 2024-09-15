const { BytenodeWebpackPlugin } = require('@herberttn/bytenode-webpack-plugin')

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/index.ts',
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json']
  },

  externals: {
    "node-adodb": "node-adodb",
  },
  plugins: [
    new BytenodeWebpackPlugin({
      compileAsModule: true,
      compileForElectron: true,
      debugLifecycle: false,
      debugLogs: false,
      keepSource: false,
      preventSourceMaps: true,
      silent: false,
    }),
  ],

};