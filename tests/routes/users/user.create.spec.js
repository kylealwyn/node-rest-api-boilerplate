import { expect } from 'chai';
import server from '../../utils/server.mock';
import User from '../../../app/models/user';
import UserFactory from '../../factories/user.factory';

const ENDPOINT = '/users';
let defaultUserPayload = UserFactory.generate();
let savedUser;

describe(`POST ${ENDPOINT}`, () => {
  before(async () => {
    await User.query().del();
    savedUser = await User.query().insert(defaultUserPayload);
  });

  beforeEach(() => {
    defaultUserPayload = UserFactory.generate();
  });

  describe('#201', () => {
    it('return an auth token upon creation', () => {
      const payload = UserFactory.generate({ email: 'newemail@gmail.com' });

      return server
        .post(ENDPOINT)
        .send(payload)
        .expect(201)
        .then((res) => {
          expect(res.body.token).to.be.defined;
          expect(res.body.user).to.be.defined;
          expect(res.body.user.email).to.equal(payload.email);
        });
    });
  });

  describe('#400', () => {
    it('requires a unique email', () => {
      const payload = UserFactory.generate({ email: savedUser.email });

      return server
        .post(ENDPOINT)
        .send(payload)
        .expect(400, {
          message: 'Something went wrong.',
          errors: {
            email: `${savedUser.email} is already in use.`,
          },
        });
    });

    it('requires a password', () => {
      delete defaultUserPayload.password;

      return server
        .post(ENDPOINT)
        .send(defaultUserPayload)
        .expect(400, {
          message: 'Something went wrong.',
          errors: {
            password: 'is required',
          },
        });
    });

    xit('requires a strong password', (done) => {
      server.post(ENDPOINT)
        .send(UserFactory.generate({ password: 'short' }))
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors).to.be.defined;
          expect(res.body.errors.password).to.equal('Password be at least 6 characters long and contain 1 number.');
          done();
        });
    });
  });
});
