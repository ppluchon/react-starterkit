module.exports = {
  parser: false,
  plugins: {
    'postcss-import': {},
    'autoprefixer': {
      browsers: [
        'last 3 version',
        'ie >= 10'
      ]
    },
    'cssnano': {}
  }
}
