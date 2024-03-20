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
    await knex.schema.createTable('meals', (table) => {
        table.uuid('id').primary(),
        table.uuid('users_id').references('users.id').notNullable()
        table.text('title').notNullable(),
        table.text('description').notNullable(),
        table.boolean('is_on_diet').notNullable(),
        table.date('date').notNullable()
        table.timestamps(true, true)
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('users').dropTable('meals')
}

