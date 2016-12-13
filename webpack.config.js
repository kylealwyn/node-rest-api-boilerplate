const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

let config = {
  devtool: 'cheap-eval-source-map',
  entry: ['./app/scripts/index.js'],
  output: {
    filename: 'bundle.js',
    path: '/public',
    publicPath: '/assets/'
  },
  module: {
    loaders: [{
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract('style-loader' , 'css-loader!sass-loader?sourceMap')
    }, {
      test: /\.js/,
      exclude: /(node_modules|bower_components)/,
      loaders: ['babel-loader']
    }, {
      test: /\.woff[2]?$/,
      loader: 'url-loader?limit=10000&minetype=application/font-woff'
    }, {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file-loader'
    }]
  },
  plugins: [
    new ExtractTextPlugin('bundle.css'),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      bootstrap: 'bootstrap-sass'
    })
  ]
}

if (process.env.NODE_ENV === 'production') {
  config.output.path = `${__dirname}/app/public/scripts/`
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress:{
        warnings: true
      }
    })
  )
} else {
  config.entry.unshift('webpack/hot/dev-server', 'webpack-hot-middleware/client')
  config.plugins.push(
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin()
  )
}

module.exports = config;
