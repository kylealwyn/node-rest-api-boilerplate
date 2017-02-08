import * as chai from 'chai';
import server from '../../utils/server.mock';
import User from '../../../app/models/user';
import UserFactory from '../../factories/user.factory';

const expect = chai.expect;

const ENDPOINT = '/auth/login';
let defaultUserPayload = UserFactory.generate();
let savedUser;

describe(`POST ${ENDPOINT}`, () => {
  before(async () => {
    await User.query().del();
    savedUser = await User.query().insert(defaultUserPayload);
  });

  describe('#200', () => {
    it('return an auth token upon successful password verification', () => {
      return server
        .post(ENDPOINT)
        .send({ email: savedUser.email, password: defaultUserPayload.password })
        .expect(200)
        .then((res) => {
          expect(res.body.token).to.be.defined;
        });
    });
  });

  describe('#401', () => {
    it('correct username, incorrect password', () => {
      return server
        .post(ENDPOINT)
        .send({ email: savedUser.email, password: 'wrong' })
        .expect(401, 'Please verify your credentials.');
    });

    it('incorrect username, incorrect password', () => {
      return server
        .post(ENDPOINT)
        .send({ email: 'wrong', password: 'wrong' })
        .expect(401, 'Please verify your credentials.');
    });
  });
});
