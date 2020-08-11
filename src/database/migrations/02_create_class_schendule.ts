import Knex from 'knex';


//criação de tabela
export async function up(knex: Knex){
return knex.schema.createTable('class_schendule', table => {
    table.increments('id').primary();
    table.integer('week_day').notNullable();
    table.integer('sc_from').notNullable();
    table.integer('sc_to').notNullable();

    table.integer('class_id').notNullable().references('id')
    .inTable('classes').onDelete('CASCADE').onUpdate('CASCADE');
});
}

//rollback
export async function down(knex: Knex)
{
    return knex.schema.dropTable('class_schendule');
}