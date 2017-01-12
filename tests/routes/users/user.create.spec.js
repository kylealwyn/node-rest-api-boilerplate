import { expect } from 'chai';
import server from '../../utils/server.mock';
import User from '../../../app/models/user';
import UserFactory from '../../factories/user.factory';

const ENDPOINT = '/users';
let defaultUserPayload = UserFactory.generate();
let savedUser;

describe(`POST ${ENDPOINT}`, () => {
  before(() => {
    return User.remove({})
      .then(() => User.create(defaultUserPayload))
      .then(u => savedUser = u);
  });

  beforeEach(() => {
    defaultUserPayload = UserFactory.generate();
  });

  describe('#201', () => {
    it('return an auth token upon creation', done => {
      server.post(ENDPOINT)
        .send(UserFactory.generate({username: 'newusername', email: 'newemail@gmail.com'}))
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.token).to.be.defined;
          done();
        });
    });
  });

  describe('#400', () => {
    it('requires unique email and username', done => {
      server.post(ENDPOINT)
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
      server.post(ENDPOINT)
        .send(defaultUserPayload)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors).to.be.defined;
          expect(res.body.errors.password).to.equal('Password is required.');
          done();
        });
    });

    it('requires a strong password', done => {
      server.post(ENDPOINT)
        .send(UserFactory.generate({password: 'short'}))
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors).to.be.defined;
          expect(res.body.errors.password).to.equal('Password be at least 6 characters long and contain 1 number.');
          done();
        });
    });
  });
});
