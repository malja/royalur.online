export const up = async function(knex) {
    await knex.schema.withSchema('public').createTable("user_tokens", (table) => {
        table.string("token", 20).unique().primary();

        table.integer("user_id").notNullable();
        table.foreign("user_id").references("id").inTable("public.users").onDelete("CASCADE");

        // Nastaveno na true, jakmile bude token použit pro přihlášení. Pak je možné využít ho pouze jako ověření hodnoty
        // v cookie, ale nikoliv jako nové přihlášení
        table.boolean("used").defaultTo(false);

        table.timestamp("created_at").defaultTo(knex.fn.now());
        // Do kdy je možné tento token použít pro prvotní přihlášení
        table.timestamp("active_until");
    });
}

export const down = async function(knex) {
    await knex.schema.dropTable("user_tokens")
}