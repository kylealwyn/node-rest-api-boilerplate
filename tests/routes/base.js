import * as chai from 'chai';
import server from '../utils/server.mock';
import constants from '../../app/config/constants';

const expect = chai.expect;

describe('Route: /', () => {
  it('should return json', () => {
    return server.get('/')
      .then(res => {
        expect(res.type).to.eql('application/json');
      });
  });

  it('should return the API version', () => {
    return server.get('/')
      .then(res => {
        expect(res.body.version).to.eql(constants.version);
      });
  });
});
