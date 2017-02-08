import { expect } from 'chai';
import server from '../../utils/server.mock';
import Service from '../../../app/models/service';
import ServiceFactory from '../../factories/service.factory';

const ENDPOINT = '/services';
let service;

describe(`GET ${ENDPOINT}/:id`, () => {
  before(async () => {
    await Service.query().del();
    await Service.query().insertGraph(ServiceFactory.generateList(5));
    service = await Service.query().first();
  });

  describe('#200', () => {
    it('should return the post with the supplied id', () => {
      return server
        .get(`${ENDPOINT}/${service.code}`)
        .expect(200, service.toJSON());
    });
  });

  describe('#404', () => {
    it('should send back unauthorized if invalid token is provided', () => {
      return server
        .get(`${ENDPOINT}/TheresNoServiceHere`)
        .expect(404);
    });
  });
});
