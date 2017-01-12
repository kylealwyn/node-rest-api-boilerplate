import { expect } from 'chai';
import server from '../../utils/server.mock';
import User from '../../../app/models/user';
import UserFactory from '../../factories/user.factory';

const ENDPOINT = '/users';

describe(`GET ${ENDPOINT}`, () => {
  before(() => {
    return User.remove({})
      .then(() => User.insertMany(UserFactory.generateList(5)));
  });

  describe('#200', () => {
    it('should return an array of users', done => {
      server.get(ENDPOINT)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.lengthOf(5);
          done();
        });
    });
  });
});
