
exports.up = (knex, Promise) =>
  Promise.all([
    knex('medications')
      .insert([{
        name: 'Altavera',
        code: 'Altavera',
      }]),
    knex('products')
      .insert([{
        displayName: 'Altavera',
        sku: '1-1',
        medicationId: 1,
      }]),
  ]);

exports.down = (knex, Promise) =>
  Promise.all([
    knex('products').del(),
    knex('medications').del(),
  ]);
