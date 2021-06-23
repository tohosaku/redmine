const path = require("path");
const WebpackAssetsManifest = require("webpack-assets-manifest");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const { NODE_ENV, WEBPACK_HOST, WEBPACK_PORT } = process.env;

const host = WEBPACK_HOST || 'localhost';
const port = WEBPACK_PORT || '3035'

const entry = {
  application: path.resolve(__dirname, "app/assets/javascripts/application.js"),
  attachments: path.resolve(__dirname, "app/assets/javascripts/attachments.js"),
  context_menu: path.resolve(__dirname, "app/assets/javascripts/context_menu.js"),
  gantt: path.resolve(__dirname, "app/assets/javascripts/gantt.js"),
  revision_graph: path.resolve(__dirname, "app/assets/javascripts/revision_graph.js"),
  project_identifier: path.resolve(__dirname, "app/assets/javascripts/project_identifier.js"),
  repository_navigation: path.resolve(__dirname, "app/assets/javascripts/repository_navigation.js"),
  context_menu_rtl: path.resolve(__dirname, "app/assets/stylesheets/context_menu_rtl.css"),
  rtl: path.resolve(__dirname, "app/assets/stylesheets/rtl.css"),
  scm: path.resolve(__dirname, "app/assets/stylesheets/scm.css"),
}

const cssRule = (isProd) => ({
  test: /\.css$/,
  use: [
    MiniCssExtractPlugin.loader,
    "css-loader",
    {
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
    }
  ]
});

const imageRule = {
  test: /\.(gif|png|jpg|eot|wof|woff|ttf|svg)$/,
  type: "asset/inline",
}

const exposeRules = [
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
]

const getPlugins = isProd => [
  new WebpackAssetsManifest({
    publicPath: true,
    output: "packs/manifest.json",
    writeToDisk: true
  }),
  new MiniCssExtractPlugin({
    filename: isProd ? "stylesheets/[name]-[contenthash].css" : "stylesheets/[name].css",
  })
]

const devServer = {
  host: WEBPACK_HOST || "0.0.0.0",
  port,
  hot: true,
  headers: {
    "Access-Control-Allow-Origin": "*"
  }
}

const optimization = {
  splitChunks: {
    cacheGroups: {
      raphael: {
        test: /[\\/]node_modules[\\/](raphael)[\\/]/,
        name: 'raphael',
        chunks: 'all',
      }
    },
  },
}

const getConfig = (isProd) => ({
  mode: isProd ? 'production' : 'development',
  devtool: "source-map",
  entry,
  output: {
    path: path.resolve(__dirname, 'public'),
    publicPath: isProd ? "/" : `//${host}:${port}/`,
    filename: isProd ? "javascripts/[name]-[contenthash].js" : "javascripts/[name].js",
    library: {
      type: 'window'
    },
  },
  resolve: {
    extensions: [".js"],
  },
  module: {
    rules: [
      cssRule(isProd),
      imageRule,
      ...exposeRules
    ],
  },
  plugins: getPlugins(isProd),
  optimization
});

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production' || NODE_ENV === "production";
  const config = getConfig(isProd);
  if (!isProd) {
    config.devServer = devServer
  }
  return config
}
