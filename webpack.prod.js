const webpack = require('webpack')

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const common = require('./webpack.common.js')
const merge = require('webpack-merge')
const path = require('path')

const sourcePath = path.resolve('./src')

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  optimization: {
    concatenateModules: true,
    nodeEnv: 'production',
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false, // set to true if you want JS source maps
        uglifyOptions: {
          output: {
            comments: false
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: false,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'style-[hash].css',
      chunkFilename: '[id].css'
    }),
    new CopyWebpackPlugin([])
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
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
  }
})
