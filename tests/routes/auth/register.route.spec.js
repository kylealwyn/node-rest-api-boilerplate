import * as chai from 'chai';
import server from '../../utils/server.mock';
import User from '../../../app/models/user';
import UserFactory from '../../factories/user.factory';

const expect = chai.expect;

let defaultUserPayload = new UserFactory();
let savedUser;

describe('Route: /auth/register/email', () => {
  before(done => {
    User.remove({})
      .then(() => {
        const user = new User(defaultUserPayload);
        return user.save();
      })
      .then(user => {
        savedUser = user;
        done();
      });
  });

  beforeEach(() => {
    defaultUserPayload = new UserFactory();
  });

  describe('201: Created', () => {
    it('return an auth token upon creation', () => {
      return server.post('/auth/register/email')
        .send(new UserFactory({username: 'newusername', email: 'newemail@gmail.com'}))
        .then(res => {
          expect(res).to.have.status(201);
          expect(res.body.token).to.be.defined;
        });
    });
  });

  describe('400: Bad Request', () => {
    it('requires unique email and username', done => {
      server.post('/auth/register/email')
        .send(savedUser.toJSON())
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors).to.be.defined;
          expect(res.body.errors.email).to.equal('Email already in use.');
          expect(res.body.errors.username).to.equal('Username already taken.');
          done();
        });
    });

    it('requires a password', done => {
      delete defaultUserPayload.password;
      server.post('/auth/register/email')
        .send(defaultUserPayload)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors).to.be.defined;
          expect(res.body.errors.password).to.equal('Password is required.');
          done();
        });
    });

    it('requires a strong password', done => {
      server.post('/auth/register/email')
        .send(new UserFactory({password: 'short'}))
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors).to.be.defined;
          expect(res.body.errors.password).to.equal('Password be at least 6 characters long and contain 1 number.');
          done();
        });
    });
  })
});
