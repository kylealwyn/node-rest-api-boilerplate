if (!role) {
  throw new Error('Required role needs to be set');
}

return (req, res, next) => {
  authenticate(req, res, () => {
    if (Constants.userRoles.indexOf(req.user.role) >=
        Constants.userRoles.indexOf(roleRequired)) {
      next();
    } else {
      res.sendStatus(403);
    }
  })
}
