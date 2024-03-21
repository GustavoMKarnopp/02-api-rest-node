import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users', (table) => {
        table.uuid('id').primary(),
        table.uuid('session_id').notNullable().unique()
        table.string('first_name', 255).notNullable(),
        table.string('last_name', 255).notNullable(),
        table.string('email').notNullable().unique()
        table.timestamps(true, true)
    })  
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('users')
}

