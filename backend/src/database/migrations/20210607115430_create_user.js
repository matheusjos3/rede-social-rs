
exports.up = function (knex) {
    return knex.schema.createTable('user', function (table) {
        table.increments('id').primary()
        table.string('email').notNullable().unique();
        table.string('name').notNullable();
        table.string('password').notNullable();
        table.string('url_avatar').defaultTo('');
        table.string('url_banner').defaultTo('');
        table.string('bio').defaultTo('');
        table.string('date_birth').notNullable();
        table.string('genre').notNullable();
        table.string('location').defaultTo('');
        table.datetime('created_at');
        table.timestamp('deleted_at');
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('user');
};
