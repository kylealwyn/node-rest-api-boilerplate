import BaseController from './base.controller';
import Service from '../models/Service';

class ServicesController extends BaseController {
  async search(req, res) {
    const services = await Service.query();

    res.json(services);
  }

  async fetch(req, res) {
    const service = await Service
      .query()
      .where({ code: req.params.code })
      .first();

    if (!service) {
      return res.sendStatus(404);
    }

    res.json(service);
  }
}

export default new ServicesController();
