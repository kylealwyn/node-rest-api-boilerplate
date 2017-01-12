# Express & ES6 API Boilerplate


## Features
- [x] ES6 for javascript awesomeness
- [x] [MongoDB](https://www.mongodb.com/) w/ [Mongoose](http://mongoosejs.com/) for data layer
- [x] Username/Email registration and authentication
- [x] Testing via [Mocha](https://mochajs.org/) & [Chai](http://chaijs.com/)
- [x] Test coverage via [Isparta](https://github.com/douglasduteil/isparta)

## Getting Started
First, ensure you have node and mongo installed on your system.


```sh
# clone it
git clone git@github.com:kylealwyn/node-api-es6-boilerplate.git
cd node-api-es6-boilerplate

# Make it your own
rm -rf .git && git init

# Install dependencies
npm install

# Run it
npm start

# Try it!
curl -H "Content-Type: application/json" -X POST -d '{"username":"jamesdean", "email": "example@gmail.com", "password":"password1"}' http://localhost:4567/users
```

## Commands

- `npm start`
  - Start live-reloading development server

- `npm test`
  - Run test suite

- `npm run test:watch`
  - Run test suite with auto-reloading

- `npm run coverage`
  - Run test coverage

- `npm run build`
  - Generates production ready application in `./build`

## Todo
- [ ] Add OAuth Login Support (Facebook, Twitter, Google)
- [ ] Add support for MySql or PostgreSQL (Possibly with sequelize)
- [x] Write tests to exemplify Mongo interactions
- [ ] Move all data retrieval logic into services to remove Mongo dependences in controllers
- [ ] Reset password functionality

## License
MIT
