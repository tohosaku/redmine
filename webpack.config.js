const path = require("path");
const WebpackAssetsManifest = require("webpack-assets-manifest");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const { NODE_ENV, WEBPACK_HOST, WEBPACK_PORT } = process.env;

const getFilename = (isProd, dirName, ext) => isProd && ext == "js" ? `${dirName}/[name]-[contenthash].${ext}` : `${dirName}/[name].${ext}?[contenthash]`;

/* stored under app/assets */
const assets = {
  application: "javascripts/application.js",
  attachments: "javascripts/attachments.js",
  context_menu: "javascripts/context_menu.js",
  gantt: "javascripts/gantt.js",
  chart: "javascripts/chart.js",
  revision_graph: "javascripts/revision_graph.js",
  project_identifier: "javascripts/project_identifier.js",
  repository_navigation: "javascripts/repository_navigation.js",
  "jstoolbar/jstoolbar": "javascripts/jstoolbar/jstoolbar.js",
  "jstoolbar/markdown": "javascripts/jstoolbar/markdown.js",
  "jstoolbar/textile": "javascripts/jstoolbar/textile.js",
  context_menu_rtl: "stylesheets/context_menu_rtl.css",
  rtl: "stylesheets/rtl.css",
  scm: "stylesheets/scm.css",
  jstoolbar: "stylesheets/jstoolbar.css",
};

/**
 * Generate an entry object for the configuration file
 * https://webpack.js.org/configuration/entry-context/#entry
 */
const entry = {}
Object.keys(assets).forEach(key => {
  entry[key] = path.resolve(__dirname, 'app/assets/', assets[key]);
})

/**
 * rule for CSS
 * https://webpack.js.org/plugins/mini-css-extract-plugin/
 */
const getCssRule = (isProd) => ({
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

/**
 * rules for images
 * !! Rules are evaluated in order from bottom to top !!
 * 
 * Due to performance reasons, the image exploration locations are limited.
 * If the images do not output properly, please review here.
 * 
 * https://webpack.js.org/guides/asset-modules/
 */
const imageRules = [
  {
    test: /public\/images\/[^/]*\.(gif|png|jpg|eot|wof|woff|ttf|svg)$/,
    type: "asset/resource",
    generator: {
      filename: 'images/[base]?[hash]'
    }
  },
  {
    test: /node_modules\/jquery-ui-dist\/images\/[^/]*\.(gif|png|jpg|eot|wof|woff|ttf|svg)$/,
    type: "asset/resource",
    generator: {
      filename: 'images/jquery-ui/[base]?[hash]'
    }
  },
  {
    test: /public\/images\/jstoolbar\/[^/]*\.(gif|png|jpg|eot|wof|woff|ttf|svg)$/,
    type: "asset/resource",
    generator: {
      filename: 'images/jstoolbar/[base]?[hash]'
    }
  },
  {
    test: /public\/images\/files\/[^/]*\.(gif|png|jpg|eot|wof|woff|ttf|svg)$/,
    type: "asset/resource",
    generator: {
      filename: 'images/files/[base]?[hash]'
    }
  },
]

/**
 * rules for "expose-loader"
 * https://webpack.js.org/loaders/expose-loader/
 */
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
      exposes: "Tribute",
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

/**
 * plugin config
 */
const getPlugins = isProd => [
  /**
   * !! The main part of webpack integration with simpacker and Redmine !!
   */
  new WebpackAssetsManifest({
    publicPath: true,
    output: "packs/manifest.json",
    writeToDisk: true
  }),
  new MiniCssExtractPlugin({
    filename: getFilename(isProd, 'stylesheets', 'css'),
  })
]

/**
 * optimization config
 * https://webpack.js.org/plugins/split-chunks-plugin/#optimizationsplitchunks
 */
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

/**
 * webpack-dev-server config
 * https://webpack.js.org/configuration/dev-server/
 */
const devServer = {
  host: WEBPACK_HOST || '0.0.0.0',
  port: WEBPACK_PORT || '3035',
  headers: {
    "Access-Control-Allow-Origin": "*"
  }
}

/**
 * setting for chacing
 * https://webpack.js.org/configuration/other-options/#cachebuilddependencies
 */
const cache = {
  type: 'filesystem',
  buildDependencies: {
    config: [__filename]
  }
}

/**
 * Bring the whole setting together
 */
const getConfig = (isProd) => ({
  mode: isProd ? 'production' : 'development',
  devtool: "source-map",
  target: ['web', 'es5'], // Remove if abandon IE11 support
  entry,
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: getFilename(isProd, 'javascripts', 'js'),
    library: {
      type: 'window'
    },
  },
  resolve: {
    extensions: [".js"],
    alias: {
      '@': path.resolve(__dirname, 'public'),
      '~': path.resolve(__dirname, 'app/assets')
    },
  },
  module: {
    rules: [
      getCssRule(isProd),
      ...imageRules,
      ...exposeRules
    ],
  },
  plugins: getPlugins(isProd),
  optimization,
  cache
});

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production' || NODE_ENV === "production";
  const config = getConfig(isProd);
  if (!isProd) {
    config.devServer = devServer
  }
  return config
}
