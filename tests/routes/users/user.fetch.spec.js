import * as chai from 'chai';
import server from '../../utils/server.mock';
import User from '../../../app/models/user';
import UserFactory from '../../factories/user.factory';

const expect = chai.expect;

const ENDPOINT = '/users';

let savedUser;
describe(`GET ${ENDPOINT}/:username`, () => {
  before(() => {
    return User.remove({})
      .then(() => {
        return User.create(UserFactory.generate())
      })
      .then(u => {
        savedUser = u;
      });
  });

  describe('200: Ok', () => {
    it('should return the user profile', done => {
      server.get(`${ENDPOINT}/${savedUser.username}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.username).to.equal(savedUser.username);
          done();
        });
    });
  });

  describe('404: Not Found', () => {
    it('return 404 if username does not exist', done => {
      server.get(`${ENDPOINT}/doesnotexist`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
  });
});
