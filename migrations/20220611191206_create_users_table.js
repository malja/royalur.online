export const up = async function(knex) {
    await knex.schema.withSchema('public').createTable("users", (table) => {
        table.increments("id").unique().primary()

        table.integer("elo").defaultTo(100);

        // E-mail slouží jako unikátní identifikátor uživatelského účtu
        table.string("email", 255).notNullable().unique()
        table.string("name", 50).notNullable().unique()

        // Aktivní je uživatel v případě, že se poprvé přihlásil
        table.boolean("active").defaultTo(false)
        // Povolený uživatel se může přihlásit. Díky tomu je možné některé uživatele "banovat"
        table.boolean("enabled").defaultTo(true)

        table.timestamp("created_at").defaultTo(knex.fn.now())
        table.timestamp("last_login_at").defaultTo(null);
    });
}

export const down = async function(knex) {
    await knex.schema.dropTable("users");
}
