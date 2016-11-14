import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Post from './post';
const authTypes = ['github', 'twitter', 'facebook', 'google'];

const Schema = mongoose.Schema;
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
  role: {
    type: String,
    default: 'user'
  }
}, {
  timestamps: true
});

// Strip out password field when sending user object to client
UserSchema.set('toJSON', {
  virtuals: true,
  transform(doc, obj) {
    delete obj.password;
    return obj;
  }
});

// Ensure email has not been taken
UserSchema
  .path('email')
  .validate(function(email, respond) {
    this.constructor.findOne({email})
      .then(user => { respond(user ? false : true) })
      .catch(() => { respond(false) });
  }, 'Email already in use.');

// Validate username is not taken
UserSchema
  .path('username')
  .validate(function (username, respond) {
    this.constructor.findOne({username})
      .then(user => { respond(user ? false : true) })
      .catch(() => { respond(false) });
  }, 'Username already taken.');

// Validate password field
UserSchema
  .path('password')
  .validate(function (password) {
    if (~authTypes.indexOf(this.provider)) {
      return true;
    }

    return password.length >= 6 && password.match(/\d+/g);
  }, 'Password be at least 6 characters long and contain 1 number.');

//
UserSchema
  .pre('save', function (save) {
    // We must encrypt password before saving the document
    if (this.isModified('password')) {
      this.password = this._hashPassword(this.password)
    }

    save();
  });

/**
 * User Methods
 */
UserSchema.methods = {
  getPosts() {
    return Post.find({ _user: this._id });
  },

  /**
   * Authenticate - check if the passwords are the same
   *
   * @api public
   * @param {String} password
   * @return {Boolean} passwords match
   */
  authenticate(password) {
    return bcrypt.compareSync(password, this.password);
  },

  /**
   * Create password hash
   * @api private
   * @param {String} password
   * @return {Boolean} passwords match
   */
  _hashPassword(password, byteSize = 12) {
    return bcrypt.hashSync(password, byteSize)
  }
};

export default mongoose.model('User', UserSchema);
