import '../styles/app.scss'

window.$ = window.jQuery = require('jquery');

import Http from './lib/http'

Object.assign(window, {
  Http
})

/****************************
DEVELOPMENT ONLY
*****************************/
if (module.hot) {
  module.hot.accept();
  document.querySelectorAll('link[href][rel=stylesheet]').forEach(link => {
    const nextStyleHref = link.href.replace(/(\?\d+)?$/, `?${Date.now()}`);
    link.href = nextStyleHref;
  });
}
