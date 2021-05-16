const path = require("path");
const WebpackAssetsManifest = require("webpack-assets-manifest");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const { NODE_ENV, WEBPACK_HOST, WEBPACK_PORT } = process.env;
const isProd = NODE_ENV === "production";

const host = WEBPACK_HOST || 'localhost';
const port = WEBPACK_PORT || '3035'

module.exports = {
  mode: isProd ? "production" : "development",
  devtool: "source-map",
  entry: {
    application: path.resolve(__dirname, "app/assets/javascripts/application.js"),
  },
  output: {
    path: path.resolve(__dirname, "public/packs"),
    publicPath: isProd ? "/packs/" : `//${host}:${port}/packs/`,
    filename: isProd ? "[name]-[hash].js" : "[name].js",
  },
  resolve: {
    extensions: [".js"],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(gif|png|jpg|eot|wof|woff|ttf|svg)$/,
        type: "asset/inline",
      }  
    ],
  },
  plugins: [
    new WebpackAssetsManifest({
      publicPath: true,
      output: "manifest.json",
      writeToDisk: true
    }),
    new MiniCssExtractPlugin({
      filename: isProd ? "[name]-[hash].css" : "[name].css",
    })
  ],
  devServer: {
    host: WEBPACK_HOST || "0.0.0.0",
    port,
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  }
};
