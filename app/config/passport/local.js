import Users from '../../models/user';
import { Strategy as LocalStrategy } from 'passport-local';

function authenticate(username, password, done) {
  Users.findOne({ username })
    .then(user => {
      if (!user) {
        return done({message: 'This username is not registered.'});
      }

      return user.authenticate(password) ? done(null, user) : done({message: 'Please verify your credentials.'});
    })
    .catch(err => { done(err) });
}

export default new LocalStrategy({
  session: false
}, authenticate);
