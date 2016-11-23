import faker from 'faker';

class UserFactory {
  generateList(count, attrs = {}) {
    let list = []
    while(count) {
      list.push(this.generate(attrs));
      count--;
    }
    return list;
  }

  generate(attrs) {
    return Object.assign({}, {
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: 'password1',
      role: 'user'
    }, attrs);
  }
}

export default new UserFactory();
