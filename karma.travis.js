'use strict'

const path = require('path')

module.exports = function(config) {
  config.set({
    basePath: '',

    frameworks: ['mocha'],

    files: ['test/**/*.spec.js'],

    preprocessors: {
      'test/**/*.spec.js': 'webpack'
    },

    webpack: {
      devtool: 'inline-source-map',
      module: {
        preLoaders: [
          {
            test: /\.js$/,
            include: path.resolve('src/'),
            exclude: /utils/,
            loader: 'isparta'
          }
        ],
        loaders: [
          {
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel', // 'babel-loader' is also a legal name to reference
            query: {
              presets: ['es2015']
            }
          }
        ]
      }
    },

    reporters: ['mocha', 'coverage'],

    coverageReporter: {
      dir : 'coverage/',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'lcovonly', subdir: '.', file: 'lcov.txt' }
      ]
    },

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    browsers: ['Firefox'],

    singleRun: true
  })
}
