exports.up = (knex) =>
    knex.schema
      .createTable('users', (t) => {
        t.increments('id').primary();

        t.string('email').index().unique();
        t.string('username').index().unique();
        t.string('firstName');
        t.string('lastName');
        t.string('password');

        t.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
        t.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
      })

      .createTable('services', (t) => {
        t.increments('id').primary();

        t.string('name').notNullable();
        t.string('code').index().unique().notNullable();
        t.text('description');
        t.integer('minAge');
        t.integer('maxAge');
        t.enu('genders', ['male', 'female', 'all']);
      })

      .createTable('medications', (t) => {
        t.increments('id').primary();

        t.string('name').index();
        t.string('code').index().unique();
        t.string('sku', 10).index().unique();

        t.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
        t.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
      })

      .createTable('states', (t) => {
        t.increments('id').primary();

        t.string('longName');
        t.string('shortName').index().unique();
      })

      .createTable('services_medications', (t) => {
        t.integer('serviceId').unsigned().references('services.id').onDelete('CASCADE');
        t.integer('medicationId').unsigned().references('medications.id').onDelete('CASCADE');
      })

      .createTable('services_states', (t) => {
        t.integer('serviceId').unsigned().references('services.id').onDelete('CASCADE');
        t.integer('stateId').unsigned().references('states.id').onDelete('CASCADE');
      })

      .createTable('visits', (t) => {
        t.increments('id').primary();

        t.integer('amount');
        t.string('code').index().unique();
        t.integer('userId').unsigned().references('users.id');
        t.integer('medicationId').unsigned().references('medications.id');

        t.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
        t.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
      })

      .createTable('messages', (t) => {
        t.increments('id').primary();

        t.integer('fromId').unsigned().references('users.id');
        t.integer('toId').unsigned().references('users.id');
        t.text('content');
        t.dateTime('readAt');
        t.dateTime('sentAt');
      });

exports.down = (knex) =>
    knex.schema
      .dropTableIfExists('messages')
      .dropTableIfExists('visits')
      .dropTableIfExists('services_states')
      .dropTableIfExists('services_medications')
      .dropTableIfExists('medications')
      .dropTableIfExists('states')
      .dropTableIfExists('services')
      .dropTableIfExists('users');
