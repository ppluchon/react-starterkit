const webpack = require('webpack')
const common = require('./webpack.common.js')
const merge = require('webpack-merge')
const path = require('path')

const sourcePath = path.resolve('./src')

// DEV rules
module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(
      {
        // Options...
      }
    )
  ],
  module: {
    rules: [
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
          { loader: 'css-loader', options: { sourceMap: true, url: false } },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } },
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [
                // path.join(sourcePath, 'style', 'reboot.scss'),
                // path.join(sourcePath, 'style', 'fonts.scss'),
                path.join(sourcePath, 'style', 'variables.scss'),
                path.join(sourcePath, 'style', 'mixins.scss'),
                // path.join(sourcePath, 'style', 'base.scss'),
                path.join(sourcePath, 'style', 'mq.scss')
              ]
            }
          }
        ]
      }
    ]
  },
  devServer: {
    contentBase: '/src/assets/',
    publicPath: '/',
    clientLogLevel: 'warning',
    open: true,
    hot: true,
    host: '0.0.0.0',
    overlay: true,
    quiet: true
  }
})
