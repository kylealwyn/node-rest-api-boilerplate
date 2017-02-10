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
        t.integer('minAge').defaultTo(18);
        t.integer('maxAge');
        t.boolean('isChoosable').defaultTo(false);
        t.enu('genders', ['male', 'female', 'all']);
      })

      .createTable('content', (t) => {
        t.increments('id').primary();

        t.string('name').notNullable();
        t.string('code').index().unique().notNullable();
        t.text('appContent', 'longtext');
        t.text('webContent', 'longtext');

        t.dateTime('effectiveAt');
        t.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
        t.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
      })

      .createTable('medications', (t) => {
        t.increments('id').primary();

        t.string('name').index();
        t.string('code').index().unique();

        t.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
        t.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
      })

      .createTable('products', (t) => {
        t.increments('id').primary();

        t.string('displayName');
        t.integer('amount');
        t.string('sku', 10).index().unique();
        t.integer('quantity').notNullable().defaultTo(1);
        t.string('dosage');

        t.integer('medicationId').unsigned().references('medications.id');
      })

      .createTable('states', (t) => {
        t.increments('id').primary();

        t.string('name');
        t.string('code').index().unique();
      })

      .createTable('tasks', (t) => {
        t.increments('id').primary();

        t.string('title').notNullable();
        t.text('description');
        t.string('code').notNullable();
        t.string('type').notNullable();
        t.integer('position');
        t.string('button');

        t.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
        t.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
      })

      .createTable('visits', (t) => {
        t.increments('id').primary();

        t.integer('amount');
        t.integer('userId').unsigned().references('users.id');
        t.integer('productId').unsigned().references('products.id');

        t.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
        t.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
      })

      .createTable('services_medications', (t) => {
        t.integer('serviceId').unsigned().references('services.id').onDelete('CASCADE');
        t.integer('medicationId').unsigned().references('medications.id').onDelete('CASCADE');
      })

      .createTable('services_states', (t) => {
        t.integer('serviceId').unsigned().references('services.id').onDelete('CASCADE');
        t.integer('stateId').unsigned().references('states.id').onDelete('CASCADE');
        t.boolean('requiresVideo').defaultTo(false);
      })

      // .createTable('services_tasks', (t) => {
      //   t.integer('serviceId').unsigned().references('services.id').onDelete('CASCADE');
      //   t.integer('stateId').unsigned().references('tasks.id').onDelete('CASCADE');
      //   t.integer('position').notNullable();
      // })

      .createTable('visits_tasks', (t) => {
        t.increments('id').primary();

        t.integer('visitId').unsigned().references('visits.id');
        t.integer('taskId').unsigned().references('tasks.id');
        t.integer('status');

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
      .dropTableIfExists('visits_tasks')
      .dropTableIfExists('services_states')
      .dropTableIfExists('services_medications')
      // .dropTableIfExists('services_tasks')
      .dropTableIfExists('visits')
      .dropTableIfExists('products')
      .dropTableIfExists('medications')
      .dropTableIfExists('tasks')
      .dropTableIfExists('states')
      .dropTableIfExists('content')
      .dropTableIfExists('services')
      .dropTableIfExists('users');
