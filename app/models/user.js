import mongoose from 'mongoose';
import crypto from 'crypto';
import Post from './post';
const Schema = mongoose.Schema;
const authTypes = ['github', 'twitter', 'facebook', 'google'];

const UserSchema = new Schema({
  firstname: String,
  lastname: String,
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, 'Email is required'],
    validator(email) {
      const emailRegex = /^[-a-z0-9%S_+]+(\.[-a-z0-9%S_+]+)*@(?:[a-z0-9-]{1,63}\.){1,125}[a-z]{2,63}$/i;
      return emailRegex.test(email);
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required.']
  },
  salt: String,
  role: {
    type: String,
    default: 'user'
  },
  posts: [ {type : mongoose.Schema.ObjectId, ref : 'Post'} ]
}, {
  timestamps: true
});

UserSchema.set('toJSON', {
  virtuals: true,
  transform(doc, obj) {
    delete obj.password;
    delete obj.salt;
    return obj;
  }
});

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function(email, respond) {
    this.constructor
      .findOne({email})
      .then(user => { respond(user ? false : true) })
      .catch(() => { respond(false) });
  }, 'Email already in use.');

// Validate username is not taken
UserSchema
  .path('username')
  .validate(function (username, respond) {
    this.constructor
      .findOne({username})
      .then(user => { respond(user ? false : true) })
      .catch(() => { respond(false) });
  }, 'Username already taken.');

// Validate empty password
UserSchema
  .path('password')
  .validate(function (password) {
    if (~authTypes.indexOf(this.provider)) {
      return true;
    }
    return password.length >= 6 && password.match(/\d+/g);
  }, 'Password be at least 6 characters long and contain 1 number.');

// Re-encrypt password before saving the document
UserSchema
  .pre('save', function (next) {
    // Handle new/update passwords
    if (this.isModified('password')) {
      this.salt = this.makeSalt();
      this.password = this.encryptPassword(this.password)
      next();
    } else {
      next();
    }
  });

/**
 * Methods
 */
UserSchema.methods = {
  getPosts() {
    return Post.find({ _user: this._id });
  },

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} password
   * @param {Function} callback
   * @return {Boolean}
   * @api public
   */
  verifyPassword(password) {
    return this.password === this.encryptPassword(password);
  },

  /**
   * Make salt
   *
   * @param {Number} byteSize Optional salt byte size, default to 16
   * @return {String}
   */
  makeSalt(byteSize=16) {
    return crypto.randomBytes(byteSize).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   */
  encryptPassword(password) {
    if (!password || !this.salt) {
      return null;
    }

    const defaultIterations = 10000;
    const defaultKeyLength = 64;
    const salt = new Buffer(this.salt, 'base64');

    return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength).toString('base64');
  }
};

export default mongoose.model('User', UserSchema);
