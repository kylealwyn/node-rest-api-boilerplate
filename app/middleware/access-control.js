import authenticate from './authenticate';

export default function accessControl(role) {
  if (!role) {
    throw new Error('Required role needs to be set');
  }

  return (req, res, next) => {
    authenticate(req, res, () => {
      next();
    });
  };
}
