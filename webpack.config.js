const path = require("path");
const WebpackAssetsManifest = require("webpack-assets-manifest");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const { NODE_ENV, WEBPACK_HOST, WEBPACK_PORT } = process.env;
const isProd = NODE_ENV === "production";

const host = WEBPACK_HOST || 'localhost';
const port = WEBPACK_PORT || '3035'

const postCssLoader = {
  loader: "postcss-loader",
  options: {
    sourceMap: !isProd,
    postcssOptions: {
      plugins: [
        require('cssnano')({
          preset: ['default', {minifyFontValues: {removeQuotes: false}}]
        })
      ]
    },
  },
};

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
        use: [MiniCssExtractPlugin.loader, "css-loader", postCssLoader],
      },
      {
        test: /\.(gif|png|jpg|eot|wof|woff|ttf|svg)$/,
        type: "asset/inline",
      },
      {
        test: require.resolve("jquery"),
        loader: "expose-loader",
        options: {
          exposes: ["$","jQuery"],
        }
      },
      {
        test: require.resolve("tributejs"),
        loader: "expose-loader",
        options: {
          exposes: "Trubute",
        }
      },
      {
        test: require.resolve("tablesort"),
        loader: "expose-loader",
        options: {
          exposes: "Tablesort",
        }
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
