const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// const WebpackObfuscator = require('webpack-obfuscator');
const { BytenodeWebpackPlugin } = require('@herberttn/bytenode-webpack-plugin')

module.exports = [
  new ForkTsCheckerWebpackPlugin(),
   new BytenodeWebpackPlugin({ compileForElectron: true }),
  // new WebpackObfuscator({
  //   rotateStringArray: true
  // }, ['.webpack/main/index.js'])
];
