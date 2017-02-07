import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import isEmail from 'validator/lib/isEmail';
import Bookshelf from '../database';
import Constants from '../config/constants';
import './post.model';

class User extends Bookshelf.Model {
  get hidden() {
    return ['password', 'created_at', 'updated_at'];
  }

  get rules() {
    return rules;
  }

  get hasTimestamps() {
    return true;
  }
  get tableName() {
    return 'users';
  }

  initialize() {
    super.initialize();
    this.on('saving', this.hashPassword);
  }

  posts() {
    return this.hasMany('Post');
  }

  /**
   * Create password hash
   * @return {Promise}
   */
  hashPassword() {
    return new Promise((resolve, reject) => {
      if ('password' in this.changed) {
        bcrypt.hash(this.get('password'), 4, (err, hash) => {
          if (err) {
            return reject(err);
          }

          this.set({ password: hash });
          resolve();
        });
      }
    });
  }

  /**
   * Authenticates user
   * @param {String} password to check
   * @return {Boolean} whether passwords match
   */
  authenticate(password) {
    return bcrypt.compareSync(password, this.get('password'));
  }

  /**
   * Generates a JSON Web token used for route authentication
   * @return {String} signed JSON web token
   */
  generateToken() {
    return jwt.sign({ id: this.get('id') }, Constants.security.sessionSecret, {
      expiresIn: Constants.security.sessionExpiration,
    });
  }
}

const rules = {
  firstname: {
    required: true,
    message: '{VALUE} is not a valid firstname. It must be a string.',
    validator(name) {
      return typeof name === 'string';
    },
  },
  email: {
    required: true,
    async validator(email) {
      console.log(this);
      if (!isEmail(email)) {
        throw new Error(`${email} is not a valid email.`);
      }

      const user = await User.where({ email }).fetch();

      if (user) {
        throw new Error(`${email} is already taken.`);
      }

      return true;
    },
  },
};

export default User;
