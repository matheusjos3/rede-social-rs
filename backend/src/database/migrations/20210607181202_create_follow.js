
exports.up = function (knex) {
    return knex.schema.createTable('follow', function (table) {
        table.increments('id').primary();
        table.integer('id_user').unsigned().notNullable();
        table.integer('id_following').unsigned().notNullable();

        table.foreign('id_user').references('id').inTable('user');
        table.foreign('id_following').references('id').inTable('user');
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('follow');
};
