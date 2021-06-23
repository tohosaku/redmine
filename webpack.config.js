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
    attachments: path.resolve(__dirname, "app/assets/javascripts/attachments.js"),
    context_menu: path.resolve(__dirname, "app/assets/javascripts/context_menu.js"),
    gantt: path.resolve(__dirname, "app/assets/javascripts/gantt.js"),
    revision_graph: path.resolve(__dirname, "app/assets/javascripts/revision_graph.js"),
    project_identifier: path.resolve(__dirname, "app/assets/javascripts/project_identifier.js"),
    repository_navigation: path.resolve(__dirname, "app/assets/javascripts/repository_navigation.js")
  },
  output: {
    path: path.resolve(__dirname, "public/packs"),
    publicPath: isProd ? "/packs/" : `//${host}:${port}/packs/`,
    filename: isProd ? "[name]-[hash].js" : "[name].js",
    library: {
      type: 'window'
    },
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
  optimization: {
    splitChunks: {
      cacheGroups: {
        raphael: {
          test: /[\\/]node_modules[\\/](raphael)[\\/]/,
          name: 'raphael',
          chunks: 'all',
        }
      },
    },
  },
  devServer: {
    host: WEBPACK_HOST || "0.0.0.0",
    port,
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  }
};
