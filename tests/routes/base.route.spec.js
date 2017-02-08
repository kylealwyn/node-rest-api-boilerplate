import server from '../utils/server.mock';
import constants from '../../app/config/constants';

describe('GET /', () => {
  describe('#200', () => {
    it('should return the API version', () => {
      return server
        .get('/')
        .expect(200, {
          version: constants.version,
        });
    });
  });
});
