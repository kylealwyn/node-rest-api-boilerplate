import authenticate from './authenticate';

export default function redirectAuthenticated(redirectPath) {
  if (!redirectPath) {
    throw new Error('Provide a redirectPath.');
  }

  return (req, res, next) => {
    authenticate(req, res, () => {
      if (req.currentUser && req.path !== redirectPath) {
        res.redirect(redirectPath)
        return
      }

      next()
    })
  }
}
