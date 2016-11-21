import passport from 'passport';
import localStrategy from './local';

export default function initialize() {
  const initialized = passport.initialize();

  passport.use(localStrategy);

  return initialized;
}

export {
  localStrategy
}
