'use strict'

module.exports = {
  entry: './src/index.js',

  output: {
    path: 'dist',
    filename: 'ko-component-tester.js',
    library:  'ko-component-tester',
    libraryTarget: 'umd'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          presets: ['es2015']
        }
      }
    ]
  },

  externals: {
    'jquery': {
      root: 'jQuery',
      commonjs: 'jquery',
      commonjs2: 'jquery',
      amd: 'jquery'
    },
    'knockout': {
      root: 'ko',
      commonjs: 'knockout',
      commonjs2: 'knockout',
      amd: 'knockout'
    }
  }
}
