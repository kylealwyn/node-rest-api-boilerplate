import passport from 'passport';
import config from '../environment';
import User from '../../models/user';
import { Strategy as LocalStrategy } from 'passport-local';


function authenticate(username, password, done) {
  User.findOne({ username }, (err, user) => {
    if (err) {
      return done(err);
    }

    if (!user) {
      return done(null, false, {
        message: 'This username is not registered.'
      });
    }

    user.authenticate(password, function(authError, authenticated) {
      if (authError) {
        return done(authError);
      }
      if (!authenticated) {
        return done(null, false, {
          message: 'This password is not correct.'
        });
      } else {
        return done(null, user);
      }
    });
  });
}

module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password' // this is the virtual field on the model
  }, (username, password, done) => authenticate(username, password, done)));
};
