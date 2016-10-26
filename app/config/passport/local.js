import UserModel from '../../models/user';
import { Strategy as LocalStrategy } from 'passport-local';


function authenticate(username, password, next) {
  UserModel.findOne({ username }, (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return next(null, false, {
        message: 'This username is not registered.'
      });
    }

    user.authenticate(password, function(authError, authenticated) {
      if (authError) {
        return next(authError);
      }
      if (!authenticated) {
        return next(null, false, {
          message: 'This password is not correct.'
        });
      } else {
        return next(null, user);
      }
    });
  });
}

export default new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password' // this is the virtual field on the model
}, authenticate);
