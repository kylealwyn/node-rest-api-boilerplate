import authenticate from './authenticate';

// TODO
export default function accessControl(role) {
  if (!role) {
    throw new Error('Required role needs to be set');
  }

  return (req, res, next) => {
    authenticate(req, res, () => {
      next()
    })
  }
}
