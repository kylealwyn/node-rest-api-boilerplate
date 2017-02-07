exports.up = (knex, Promise) =>
  Promise.all([
    knex.schema.createTable('users', (t) => {
      t.increments('id');

      t.string('email').index().unique();
      t.string('username').index().unique();
      t.string('firstname');
      t.string('lastname');
      t.string('password');

      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    }),
  ]);

exports.down = (knex, Promise) =>
  Promise.all([
    knex.schema.dropTable('users'),
  ]);
