module.exports = {
  entry: './ko-component-tester.js',
  output: {
    path: __dirname + '/dist',
    filename: 'ko-component-tester.js'
  },
  module: {
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
}
