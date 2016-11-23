// factories/game.js
import faker from 'faker';

export default function MockUser(attrs) {
  Object.assign(this, {
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: 'password1',
    role: 'user'
  }, attrs);

  return this;
}
