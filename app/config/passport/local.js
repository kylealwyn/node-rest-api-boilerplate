import Users from '../../models/user';
import { Strategy as LocalStrategy } from 'passport-local';

function authenticate(username, password, next) {
  Users
    .findOne({ username })
    .then(user => {
      if (!user) {
        return next({ message: 'This username is not registered.' });
      }

      return user.verifyPassword(password) ? next(null, user) : next({message: 'Please verify your credentials.'});
    })
    .catch(err => { next(err) });
}

export default new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password' // this is the virtual field on the model
}, authenticate);
