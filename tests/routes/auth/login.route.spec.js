import * as chai from 'chai';
import server from '../../utils/server.mock';
import User from '../../../app/models/user';
import UserFactory from '../../factories/user.factory';

const expect = chai.expect;

const ENDPOINT = '/auth/login'
let defaultUserPayload = new UserFactory();
let savedUser;

describe(`Route: ${ENDPOINT}`, () => {
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

  describe('200: Ok', () => {
    it('return an auth token upon successful password verification', () => {
      return server.post(ENDPOINT)
        .send({username: savedUser.username, password: defaultUserPayload.password})
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body.token).to.be.defined;
        });
    });
  });

  describe('401: Unauthorized', () => {
    it('correct username, incorrect password', done => {
      server.post(ENDPOINT)
        .send({username: savedUser.username, password: 'wrong'})
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.equal('Please verify your credentials.')
          done();
        });
    });

    it('incorrect username, incorrect password', done => {
      server.post(ENDPOINT)
        .send({username: 'wrong', password: 'wrong'})
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.equal('This username is not registered.')
          done();
        });
    });
  })
});
