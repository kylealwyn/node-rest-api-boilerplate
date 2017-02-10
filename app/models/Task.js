import Model from './Model';

export default class Service extends Model {
  static tableName = 'services'

  static schema = {
    name: {
      required: true,
    },
    code: {
      required: true,
    },
    description: {},
  }
}
