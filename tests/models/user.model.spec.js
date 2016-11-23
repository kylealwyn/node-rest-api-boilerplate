import * as chai from 'chai';
import server from '../utils/server.mock';
const expect = chai.expect;

import User from '../../app/models/user';
import Post from '../../app/models/post';

const masterUserCopy = {
  username: 'jamesdean',
  email: 'jamesdean@gmail.com',
  password: 'password1'
}

let savedUser;
let defaultUser;
describe('Model: User', () => {
  before(done => {
    User.remove({})
      .then(() => {
        const user = new User(masterUserCopy);
        return user.save();
      })
      .then(user => {
        savedUser = user;
        done()
      });
  });

  beforeEach(() => {
    defaultUser = Object.assign({}, masterUserCopy);
  });

  describe('#save', () => {
    it('requires an email, username, and password', () => {
      const user = new User();

      const {errors} = user.validateSync();

      expect(errors.username).to.be.defined;
      expect(errors.email).to.be.defined;
      expect(errors.password).to.be.defined;
    })

    it('requires a valid email', function () {
      const wrongEmail = 'lolwrongemail';
      defaultUser.email = wrongEmail;

      const user = new User(defaultUser);

      const {errors} = user.validateSync();

      expect(errors.email).to.be.defined;
      expect(errors.email.message).to.equal(`${wrongEmail} is not a valid email.`)
    });

    it('should validate password strength', () => {
      const user = new User(defaultUser);
      user.password = 'wrong'; // incorrect length, no number

      let validation = user.validateSync();

      expect(validation.errors.password).to.be.defined;
      expect(validation.errors.password.message).to.equal('Password be at least 6 characters long and contain 1 number.');

      user.password = 'lololol'; // correct length, no number
      validation = user.validateSync();

      expect(validation.errors.password).to.be.defined;

      user.password = 'password1'; // correct length with number
      validation = user.validateSync();

      expect(validation).to.be.undefined;
    });
  });

  describe('#authenticate', () => {
    it('should be authenticate with correct password', () => {
      expect(savedUser.authenticate(defaultUser.password)).to.be.truthy;
    });

    it('should not authenticate with incorrect password', () => {
      expect(savedUser.authenticate('lolwrongpass')).to.be.falsy;
    });
  });

  describe('#toJSON', () => {
    it('should remove password', () => {
      const jsonUser = savedUser.toJSON();
      expect(savedUser.password).to.exist;
      expect(jsonUser.password).to.not.exist;
    });

    it('should remove __v', () => {
      const jsonUser = savedUser.toJSON();
      expect(savedUser.__v).to.exist;
      expect(jsonUser.__v).to.not.exist;
    });

    it('should convert _id to id', () => {
      const jsonUser = savedUser.toJSON();
      expect(savedUser._id).to.exist;
      expect(jsonUser._id).to.not.exist;
      expect(jsonUser.id).to.exist;
    });
  });
});
