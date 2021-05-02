const path = require("path");
const WebpackAssetsManifest = require("webpack-assets-manifest");

const { NODE_ENV } = process.env;
const isProd = NODE_ENV === "production";

module.exports = {
  mode: isProd ? "production" : "development",
  devtool: "source-map",
  entry: {
    application: path.resolve(__dirname, "app/assets/javascripts/application.js"),
  },
  output: {
    path: path.resolve(__dirname, "public/packs"),
    publicPath: isProd ? "/packs/" : "//localhost:3035/packs/",
    filename: isProd ? "[name]-[hash].js" : "[name].js",
  },
  resolve: {
    extensions: [".js"],
  },
  plugins: [
    new WebpackAssetsManifest({
      publicPath: true,
      output: "manifest.json",
      writeToDisk: true
    }),
  ],
  devServer: {
    host: "0.0.0.0",
    port: 3035,
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  }
};
