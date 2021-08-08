
exports.up = function(knex) {
    return knex.schema.createTable('like', function (table) {
        table.increments('id').primary()
        table.integer('id_post').unsigned().notNullable()
        table.integer('id_user').unsigned().notNullable()

        table.foreign('id_post').references('id').inTable('post');
        table.foreign('id_user').references('id').inTable('user');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('like');
};
