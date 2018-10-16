const path = require('path')
const webpack = require('webpack')
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

const jsSourcePath = path.resolve('src')
const buildPath = path.resolve('./build')
const imgPath = path.resolve('./src/assets/img')
const objectPath = path.resolve('./src/assets/objects')
const sourcePath = path.resolve('./src')

module.exports = {
  mode: 'development',
  entry: {
    js: './src/index.js'
  },
  output: {
    path: buildPath,
    publicPath: '/',
    filename: 'app-[hash].js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: [/node_modules/],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      { test: /\.(glsl|frag|vert)$/, use: 'raw-loader' },
      {
        test: /\.(png|gif|jpe?g|svg)$/,
        include: [imgPath, objectPath],
        // use: 'url-loader?limit=20480&name=assets/[name]-[hash].[ext]'
        use: {
          loader: 'url-loader',
          options: {
            limit: 2048,
            outputPath: 'assets/'
          }
        }
      },
      {
        type: 'javascript/auto',
        test: /\.(json)$/,
        include: [imgPath, objectPath],
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets/'
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [
      '.webpack-loader.js',
      '.web-loader.js',
      '.loader.js',
      '.js',
      '.jsx'
    ],
    modules: [path.resolve(__dirname, 'node_modules'), jsSourcePath],
    alias: {
      '~ui': path.resolve('./src/App/components/ui'),
      '~views': path.resolve('./src/App/components/views'),
      '~assets': path.resolve('./src/assets'),
      Utils: path.resolve('./src/App/utils/Utils'),
      Datas: path.resolve('./src/App/utils/Datas'),
      ParseManager: path.resolve('./src/App/utils/ParseManager')
    },
    plugins: [new DirectoryNamedWebpackPlugin()]
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minChunks: Infinity
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(sourcePath, 'assets', 'index.html'),
      path: buildPath,
      filename: 'index.html'
    }),

    new ProgressBarPlugin()
  ]
}
