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
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
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

var validatePresenceOf = value => value && value.length;

UserSchema.set('toJSON', {
  virtuals: true,
  transform(doc, obj, options) {
    delete obj.password;
    delete obj.salt;
    return obj;
  }
});

// Validate empty password
UserSchema
  .path('password')
  .validate(function(password) {
    if (~authTypes.indexOf(this.provider)) {
      return true;
    }
    return password.length;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function(email, respond) {
    var self = this;
    this.constructor.findOne({email}, (err, user) => {
      if (err) {
        throw err;
      }

      if (user) {
        if (this.id === user.id) {
          return respond(true);
        }
        return respond(false);
      }

      return respond(true);
    });
  }, 'The specified email address is already in use.');

// Validate email is not taken
UserSchema
  .path('username')
  .validate(function (username, respond) {
    this.constructor.findOne({username}, (err, user) => {
      if (user) {
        if (this.id === user.id) {
          return respond(true);
        }
        return respond(false);
      }

      return respond(false);
    });
  }, 'This username is already in use.');

UserSchema
  .pre('save', function(next) {
    // Handle new/update passwords
    if (this.isModified('password')) {
      if (!validatePresenceOf(this.password) && ~authTypes.indexOf(this.provider) === -1) {
        next(new Error('Invalid password'));
      }

      // Make salt with a callback
      var _this = this;
      this.makeSalt(function(saltErr, salt) {
        if (saltErr) {
          next(saltErr);
        }
        _this.salt = salt;
        _this.encryptPassword(_this.password, function(encryptErr, hashedPassword) {
          if (encryptErr) {
            next(encryptErr);
          }
          _this.password = hashedPassword;
          next();
        });
      });
    } else {
      next();
    }
  });

/**
 * Methods
 */
UserSchema.methods = {
  getPosts() {
    return Post.find({ _user: this._id }).exec();
  },

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} password
   * @param {Function} callback
   * @return {Boolean}
   * @api public
   */
  authenticate: function(password, callback) {
    if (!callback) {
      return this.password === this.encryptPassword(password);
    }

    var _this = this;
    this.encryptPassword(password, function(err, pwdGen) {
      if (err) {
        callback(err);
      }

      if (_this.password === pwdGen) {
        callback(null, true);
      }
      else {
        callback(null, false);
      }
    });
  },

  /**
   * Make salt
   *
   * @param {Number} byteSize Optional salt byte size, default to 16
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  makeSalt: function(byteSize, callback) {
    var defaultByteSize = 16;

    if (typeof arguments[0] === 'function') {
      callback = arguments[0];
      byteSize = defaultByteSize;
    }
    else if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    if (!byteSize) {
      byteSize = defaultByteSize;
    }

    if (!callback) {
      return crypto.randomBytes(byteSize).toString('base64');
    }

    return crypto.randomBytes(byteSize, function(err, salt) {
      if (err) {
        callback(err);
      }
      return callback(null, salt.toString('base64'));
    });
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  encryptPassword: function(password, callback) {
    if (!password || !this.salt) {
      return null;
    }

    var defaultIterations = 10000;
    var defaultKeyLength = 64;
    var salt = new Buffer(this.salt, 'base64');

    if (!callback) {
      return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength)
                   .toString('base64');
    }

    return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, function(err, key) {
      if (err) {
        callback(err);
      }
      return callback(null, key.toString('base64'));
    });
  }
};

export default mongoose.model('User', UserSchema);
