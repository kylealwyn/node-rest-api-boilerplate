import * as chai from 'chai';
import server from '../../utils/server.mock';
import User from '../../../app/models/user';
import UserFactory from '../../factories/user.factory';

const expect = chai.expect;

const ENDPOINT = '/auth/login';

let defaultPayload;
let savedUser;

describe(`POST ${ENDPOINT}`, () => {
  before(async () => {
    await User.query().del();
    savedUser = await User.query().insert(UserFactory.generate());
  });

  beforeEach(() => {
    defaultPayload = UserFactory.generate();
  });

  describe('#200', () => {
    it('return an auth token upon successful password verification', () => {
      return server
        .post(ENDPOINT)
        .send({ email: savedUser.email, password: defaultPayload.password })
        .expect(200)
        .then((res) => {
          expect(res.body.token).to.be.defined;
        });
    });
  });

  describe('#400', () => {
    it('must have an email present', () => {
      delete defaultPayload.email;

      return server
        .post(ENDPOINT)
        .expect(400, 'You must provide an email and password.');
    });

    it('must have a password present', () => {
      delete defaultPayload.password;

      return server
        .post(ENDPOINT)
        .expect(400, 'You must provide an email and password.');
    });
  });

  describe('#401', () => {
    it('correct username, incorrect password', () => {
      return server
        .post(ENDPOINT)
        .send({ email: savedUser.email, password: 'wrong' })
        .expect(401);
    });

    it('incorrect username, incorrect password', () => {
      return server
        .post(ENDPOINT)
        .send({ email: 'wrong', password: 'wrong' })
        .expect(401);
    });
  });
});
