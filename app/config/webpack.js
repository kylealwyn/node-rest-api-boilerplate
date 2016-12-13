import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpack from 'webpack';
import webpackConfig from '../../webpack.config';

var compiler = webpack(webpackConfig);

export const devMiddleware = webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  noInfo: true,
  stats: {colors: true}
})

export const hotMiddleware = webpackHotMiddleware(compiler, {
  log: console.log
})
