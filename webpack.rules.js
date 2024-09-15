// const WebpackObfuscator = require('webpack-obfuscator');

module.exports = [
  // Add support for native node modules
  // {
  //   test: /\.node$/,
  //   use: "node-loader",
  // },
  {
    test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot)$/i,
    use: [
      {
        loader: "file-loader",
        /* ============== 
        ajouté par moi pour pouvoir afficher les images
        apres package ou make
        */
        options: {
          name: "[path][name].[ext]",
          publicPath: "..", // move up from 'main_window'
          context: "src", // set relative working folder to src
        },
        // ====================================================
      },

    ],
  },
  {
    test: /\.(m?js|node)$/,
    // exclude:'./node_modules/@journeyapps/sqlcipher/lib/binding/napi-v6-win32-x64/node_sqlite3.node',
    parser: { amd: false },
    use: {
      // loader: "@marshallofsound/webpack-asset-relocator-loader",
      loader: "@vercel/webpack-asset-relocator-loader",
      options: {
        outputAssetBase: "native_modules",
      },
    },
  },
  {
    test: /\.(tsx?|jsx?)$/, //modifié le 2021-05-15 par samloba pour accepter les fichiers .js .jsx (probleme d'affichage des états)
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: "ts-loader",
      options: {
        transpileOnly: true,
      },
    },
  },
  // {
  //   test: /\.js$/,
  //   exclude: /(node_modules|\.webpack)/,
  //   enforce: 'post',
  //   use: {
  //     loader: WebpackObfuscator.loader,
  //     options: {
  //       rotateStringArray: true
  //     }
  //   }
  // }

];
