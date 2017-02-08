
exports.up = (knex) =>
  knex('services')
    .insert([{
      name: 'Birth Control Pills',
      code: 'OCP',
    }, {
      name: 'Erectile Dysfunction',
      code: 'ED',
    }]);

exports.down = (knex) =>
  knex('services')
    .where('code', 'OCP')
    .orWhere('code', 'ED')
    .del();
