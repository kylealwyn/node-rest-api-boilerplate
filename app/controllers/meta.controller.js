import Constants from '../config/constants';

class MetaController {
  index(req, res) {
		res.json({
			version: Constants.version,
		});
	}
}

export default new MetaController();
