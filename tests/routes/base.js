import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../app/server';
import constants from '../../app/config/constants';

chai.use(chaiHttp);
const expect = chai.expect;
const mock = chai.request(server);

describe('baseRoute', () => {
  it('should be json', () => {
    return mock.get('/')
      .then(res => {
        expect(res.type).to.eql('application/json');
      });
  });

  it('should return the API version', () => {
    return mock.get('/')
      .then(res => {
        expect(res.body.version).to.eql(constants.version);
      });
  });
});
