Express & ES6 API Boilerplate
==================================

[![bitHound Score](https://www.bithound.io/github/kylealwyn/node-api-es6-boilerplate/badges/score.svg)](https://www.bithound.io/github/kylealwyn/node-api-es6-boilerplate)

This is a straightforward boilerplate for building REST APIs with ES6 and Express.

- ES6 support via [babel](https://babeljs.io)
- CORS support via [cors](https://github.com/troygoode/node-cors)
- Body Parsing via [body-parser](https://github.com/expressjs/body-parser)

> Tip: If you are using [Mongoose](https://github.com/Automattic/mongoose), you can automatically expose your Models as REST resources using [restful-mongoose](https://git.io/restful-mongoose).

Getting Started
---------------

```sh
# clone it
git clone git@github.com:kylealwyn/node-api-es6-boilerplate.git
cd node-api-es6-boilerplate

# Make it your own
rm -rf .git && git init

# Install dependencies
npm install

# Run it
PORT=8080 npm start

# With nodemon:
PORT=8080 nodemon
```


License
-------

MIT
