const webpack = require('webpack')
const path = require('path')

const DashboardPlugin = require('webpack-dashboard/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const nodeEnv = process.env.NODE_ENV || 'development'
const isProduction = nodeEnv === 'production'

const jsSourcePath = path.resolve('src')
const buildPath = path.resolve('build')
const imgPath = path.resolve('src/assets/img')
const sourcePath = path.resolve('src')

// Common plugins
const plugins = [
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: Infinity,
    filename: 'vendor-[hash].js'
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(nodeEnv)
    }
  }),
  new webpack.NamedModulesPlugin(),
  new HtmlWebpackPlugin({
    template: path.join(sourcePath, 'assets', 'index.html'),
    path: buildPath,
    filename: 'index.html'
  })
]

// Common rules
const rules = [
  {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: [
      'babel-loader'
    ]
  },
  {
    test: /\.(png|gif|jpg|svg)$/,
    include: imgPath,
    use: 'url-loader?limit=20480&name=assets/[name]-[hash].[ext]'
  },
  {
    test: /\.json$/,
    exclude: /node_modules/,
    use: 'json-loader'
  }
]

if (isProduction) {
  // Production plugins
  plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true
      },
      output: {
        comments: false
      }
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new ExtractTextPlugin('style-[hash].css')
  )

  // Production rules
  rules.push(
    {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } },
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [
                path.join(sourcePath, 'style', 'fonts.scss'),
                path.join(sourcePath, 'style', 'variables.scss'),
                path.join(sourcePath, 'style', 'mixins.scss'),
                path.join(sourcePath, 'style', 'base.scss'),
                path.join(sourcePath, 'style', 'mq.scss')
              ]
            }
          }
        ]
      })
    }
  )
} else {
  // Development plugins
  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new DashboardPlugin()
  )

  // Development rules
  rules.push(
    {
      test: /\.scss$/,
      exclude: /node_modules/,
      use: [
        'style-loader',
        // Using source maps breaks urls in the CSS loader
        // https://github.com/webpack/css-loader/issues/232
        // This comment solves it, but breaks testing from a local network
        // https://github.com/webpack/css-loader/issues/232#issuecomment-240449998
        // 'css-loader?sourceMap',
        { loader: 'css-loader', options: { sourceMap: true } },
        { loader: 'postcss-loader', options: { sourceMap: true } },
        { loader: 'sass-loader', options: { sourceMap: true } },
        {
          loader: 'sass-resources-loader',
          options: {
            resources: [
              path.join(sourcePath, 'style', 'fonts.scss'),
              path.join(sourcePath, 'style', 'variables.scss'),
              path.join(sourcePath, 'style', 'mixins.scss'),
              path.join(sourcePath, 'style', 'base.scss'),
              path.join(sourcePath, 'style', 'mq.scss')
            ]
          }
        }
      ]
    }
  )
}

module.exports = {
  devtool: isProduction ? false : 'source-map',
  entry: {
    js: './src/index.js',
    vendor: [
      'gsap',
      'react-dom',
      'react-router',
      'react'
    ]
  },
  output: {
    path: buildPath,
    publicPath: '/',
    filename: 'app-[hash].js'
  },
  module: {
    rules
  },
  resolve: {
    extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx'],
    modules: [
      path.resolve(__dirname, 'node_modules'),
      jsSourcePath
    ],
    alias: {

    }
  },
  plugins,
  devServer: {
    contentBase: isProduction ? './build' : './src',
    historyApiFallback: true,
    port: 3000,
    compress: isProduction,
    inline: !isProduction,
    hot: !isProduction,
    host: '0.0.0.0',
    stats: {
      assets: true,
      children: false,
      chunks: false,
      hash: false,
      modules: false,
      publicPath: false,
      timings: true,
      version: false,
      warnings: true,
      colors: {
        green: '\u001b[32m'
      }
    }
  }
}
