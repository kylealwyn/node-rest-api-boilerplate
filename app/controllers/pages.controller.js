import BaseController from './base.controller';

/**
 * Pages Controller renders HTML content
 */
class PagesController extends BaseController {
  index(req, res) {
    res.render(req.currentUser ? 'pages/dashboard' : 'pages/index')
  }

  login(req, res) {
    res.render('pages/auth/login')
  }

  register(req, res) {
    res.render('pages/auth/register')
  }

  admin(req, res) {
    res.render('pages/admin/index')
  }

  notFound(req, res) {
    if (req.path.includes('.html')) {
      res.render('pages/404')
    } else {
      res.sendStatus(404);
    }
  }
}

export default new PagesController();
