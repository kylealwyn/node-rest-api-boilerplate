import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Model from './Model';
import Constants from '../config/constants';
import { BadRequest } from '../lib/errors';
import isEmail from 'validator/lib/isEmail';

class User extends Model {
  static tableName = 'users'
  static hiddenFields = ['username', 'password', 'createdAt', 'updatedAt']
  static hasTimestamps = true

  static relationMappings = {
    visits: {
      relation: Model.HasManyRelation,
      modelClass: `${__dirname}/Visit`,
      join: {
        from: 'users.id',
        to: 'visits.userId',
      },
    },
  }

  static schema = {
    id: {},
    firstName: {
      message: '{VALUE} is not a valid firstname. It must be a string.',
      required: true,
      validator(name) {
        return typeof name === 'string';
      },
    },
    lastName: {
      required: true,
    },
    email: {
      required: true,
      async validator(email, options) {
        if (!isEmail(email)) {
          throw new BadRequest({
            email: `${email} is not a valid email.`,
          });
        }

        return this.constructor
          .query()
          .select('id')
          .where('email', email)
          .first()
          .then((row) => {
            if (typeof row === 'object' && row.id) {
              if (options.inserting || Number.parseInt(row.id) !== Number.parseInt(this.id)) {
                throw new BadRequest({
                  email: `${email} is already in use.`,
                });
              }
            }
          });
      },
    },
    password: {
      required: true,
      validator(password = '') {
        return password.length >= 6;
      },
    },
    createdAt: {},
    updatedAt: {},
  }

  async $beforeInsert(options) {
    await super.$beforeInsert(options);
    await this.hashPassword(options, true);
  }

  async $beforeUpdate(options) {
    await super.$beforeUpdate(options);
    await this.hashPassword(options, false);
  }


  /**
   * Create password hash
   * @return {Promise}
   */
  hashPassword(options = {}, isInsert) {
    return new Promise((resolve, reject) => {
      if (isInsert || this.password) {
        bcrypt.hash(this.password, 4, (err, hash) => {
          if (err) {
            return reject(err);
          }

          this.password = hash;
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  /**
   * Authenticates user
   * @param {String} password to check
   * @return {Boolean} whether passwords match
   */
  authenticate(password) {
    return bcrypt.compareSync(password, this.password);
  }

  /**
   * Generates a JSON Web token used for route authentication
   * @return {String} signed JSON web token
   */
  generateToken() {
    return jwt.sign({ id: this.id }, Constants.security.sessionSecret, {
      expiresIn: Constants.security.sessionExpiration,
    });
  }
}

export default User;
