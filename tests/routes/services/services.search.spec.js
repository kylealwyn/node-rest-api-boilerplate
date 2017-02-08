import { expect } from 'chai';
import server from '../../utils/server.mock';
import Service from '../../../app/models/Service';
import ServiceFactory from '../../factories/service.factory';

const ENDPOINT = '/services';

describe(`GET ${ENDPOINT}`, () => {
  before(async () => {
    await Service.query().del();
    await Service.query().insertGraph(ServiceFactory.generateList(5));
  });

  describe('#200', () => {
    it('should return an array of posts', () => {
      return server
        .get(ENDPOINT)
        .expect(200)
        .then((res) => {
          expect(res.body).to.have.lengthOf(5);
        });
    });
  });
});
