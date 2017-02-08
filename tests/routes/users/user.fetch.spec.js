import server from '../../utils/server.mock';
import User from '../../../app/models/User';
import UserFactory from '../../factories/user.factory';

const ENDPOINT = '/users';

let savedUser;

describe(`GET ${ENDPOINT}/me`, () => {
  before(async () => {
    await User.query().del();
    savedUser = await User.query().insert(UserFactory.generate());
  });

  describe('#200', () => {
    it('should return the current user\'s profile', () => {
      return server
        .get(`${ENDPOINT}/me`)
        .set('Authorization', savedUser.generateToken())
        .expect(200, savedUser.toJSON());
    });
  });

  describe('#401', () => {
    it('should return Unauthorized if wrong token is provided', () => {
      return server
        .get(`${ENDPOINT}/me`)
        .set('Authorization', 'wrongtoken')
        .expect(401);
    });
  });
});
