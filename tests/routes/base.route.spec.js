import * as chai from 'chai';
import server from '../utils/server.mock';
import constants from '../../app/config/constants';

const expect = chai.expect;

describe('GET /', () => {
  describe('#200', () => {
    it('should return json', (done) => {
      server.get('/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.type).to.eql('application/json');
          done();
        });
    });

    it('should return the API version', (done) => {
      server.get('/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.version).to.eql(constants.version);
          done();
        });
    });
  });
});
