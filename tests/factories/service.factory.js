import faker from 'faker';

class ServiceFactory {
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
      name: faker.random.words(),
      code: faker.address.zipCode(),
      description: faker.lorem.sentence(),
    }, attrs);
  }
}

export default new ServiceFactory();
