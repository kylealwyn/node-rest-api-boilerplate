
exports.up = (knex, Promise) =>
  Promise.all([
    knex.schema.createTable('posts', (t) => {
      t.increments('id');

      t.string('text');
      t.integer('user_id').unsigned().references('users.id');

      t.timestamps();
    }),
  ]);

exports.down = (knex, Promise) =>
  Promise.all([
    knex.schema.dropTable('posts'),
  ]);
