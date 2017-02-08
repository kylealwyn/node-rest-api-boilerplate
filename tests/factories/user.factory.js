import faker from 'faker';

class UserFactory {
  generateList(count, attrs = {}) {
    let list = [];
    while(count) {
      list.push(this.generate(attrs));
      count--;
    }
    return list;
  }

  generate(attrs) {
    return Object.assign({}, {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: 'password1',
    }, attrs);
  }
}

export default new UserFactory();
