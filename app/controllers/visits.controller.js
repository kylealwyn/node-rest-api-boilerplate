import { BadRequest } from '../lib/errors';

class VisitsController {
  async create(req, res) {
    const { sku } = req.body;

    if (!sku) {
      throw new BadRequest({
        sku: 'is required',
      });
    }

    const visit = await req.currentUser
      .$relatedQuery('visits')
      .insert({
        amount: 15,
        productId: sku.split('-')[0],
      });

    res.status(201).json(visit);
  }
}

export default new VisitsController();
