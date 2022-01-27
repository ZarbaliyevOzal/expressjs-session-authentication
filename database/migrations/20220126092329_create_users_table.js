/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.hasTable('users').then((exists) => {
    if (!exists) {
      return knex.schema
        .createTable('users', function(table) {
          table.bigIncrements();
          table.string('email', 255).notNullable().unique();
          table.string('name', 45).notNullable();
          table.string('password', 100).notNullable();
          table.timestamp('verified_at');
          table.timestamp('created_at').defaultTo(knex.fn.now());
          table.timestamp('updated_at');
          table.timestamp('deleted_at');
        })
        .then(() => console.log('users table migrated'))
        .catch((err) => console.log('users migration error: ' + err))
    }
  }) 
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.hasTable('users').then(function(exists) {
    if (exists) {
      return knex.schema
        .dropTable('users')
        .then(() => console.log('users table dropped'))
        .catch((err) => console.log('users table dropping error: ' + err))
    }
  }) 
};
