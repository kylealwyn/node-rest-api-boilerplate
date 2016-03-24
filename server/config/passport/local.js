import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

function localAuthenticate(User, email, password, done) {
  User.findOne({email}, function (err, user) {
    if (err) {
      return done(err);
    }

    if (!user) {
      return done(null, false, {
        message: 'This email is not registered.'
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

exports.setup = (User, config) => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password' // this is the virtual field on the model
  }, (email, password, done) => {
    return localAuthenticate(User, email, password, done);
  }));
};
