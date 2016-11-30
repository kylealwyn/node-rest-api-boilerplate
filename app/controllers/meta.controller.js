import BaseController from './base.controller';
import Constants from '../config/constants';

class MetaController extends BaseController {
  index(req, res) {
    console.log(req.session);
		res.json({
			version : Constants.version
		});
	}
}

export default new MetaController();
