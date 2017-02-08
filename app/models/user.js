import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Model from './Model';
import Constants from '../config/constants';
import { ValidationError } from 'objection';

class User extends Model {
  static tableName = 'users'
  static hiddenFields = ['username', 'password', 'createdAt', 'updatedAt']
  static hasTimestamps = true

  static jsonSchema = {
    type: 'object',
    required: ['email', 'password'],

    properties: {
      id: { type: 'integer' },
      firstName: { type: 'string', minLength: 1, maxLength: 255 },
      lastName: { type: 'string', minLength: 1, maxLength: 255 },
      email: { type: 'string' },
      phone: { type: 'string' },
      password: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  }

  // static relationMappings = {
  //   visits: {
  //     relation: Model.HasManyRelation,
  //     modelClass: `${__dirname}/Visit`,
  //     join: {
  //       from: 'user.id',
  //       to: 'visit.userId',
  //     },
  //   },
  // }

  async $beforeInsert() {
    await super.$beforeInsert();
    await this.checkUniqueness(true);
    await this.hashPassword(null, true);
  }

  async $beforeUpdate(opts) {
    await super.$beforeUpdate();
    await this.checkUniqueness(false);
    await this.hashPassword(opts, false);
  }

  checkUniqueness(isInsert) {
    return this.constructor
      .query()
      .select('id')
      .where('email', this.email)
      .first()
      .then((row) => {
        if (typeof row === 'object' && row.id) {
          if (isInsert || Number.parseInt(row.id) !== Number.parseInt(this.id)) {
            throw new ValidationError({
              email: `${this.email} is already in use.`,
            });
          }
        }
      });
    }

  /**
   * Create password hash
   * @return {Promise}
   */
  hashPassword(opts = {}, isInsert) {
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
