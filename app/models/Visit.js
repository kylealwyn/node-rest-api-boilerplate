import Model from './Model';

class Visit extends Model {
  static tableName = 'visits'

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: `${__dirname}/User`,
      join: {
        from: 'visits.userId',
        to: 'users.id',
      },
    },
  }

  static schema = {
    userId: {
      required: true,
    },
    amount: {
      required: true,
    },
    productId: {
      required: true,
    },
  }
}

export default Visit;
