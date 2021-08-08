
exports.up = function(knex) {
    return knex.schema.createTable('post', function (table) {
        table.increments('id').primary();
        table.string('url_image');
        table.string('text');
        table.boolean('visible').notNullable();
        table.datetime('created_at');
        table.integer('id_user').unsigned().notNullable()

        table.foreign('id_user').references('id').inTable('user');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('post');
};
