import Model from './Model';

export default class Service extends Model {
  static tableName = 'services'

  static jsonSchema = {
    required: ['name', 'code'],

    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
      code: { type: 'string' },
      description: { type: 'string' },
    },
  }
}
