export const up = async function (knex) {
    await knex.schema.withSchema('public').createTable('games', (table) => {
        table.increments("id").unique().primary();

        // klíč hry, bude použit pro přihlášení dalších hráčů.
        table.string("token", 20).unique().primary();

        // Může se ještě někdo připojit? Ve hře nejsou všichni hráči
        table.boolean("open").defaultTo(true);
        // Hra je veřejná. Pokud je zároveň "open", bude zobrazena na hlavní stránce.
        table.boolean("public").defaultTo(true);
        // Je hra aktivní, nebo jde o záznam v databázi pro historické potřeby?
        table.boolean("active").defaultTo(true);

        // Hráč 1, pokud je anonym, bude NULL
        table.integer("player_1").nullable().defaultTo(null);
        table.foreign("player_1").references("id").inTable("public.users").onDelete("SET NULL");

        // Hráč 2, pokud je anonym, bude NULL
        table.integer("player_2").nullable().defaultTo(null);
        table.foreign("player_2").references("id").inTable("public.users").onDelete("SET NULL");

        // Kdo vyhrál, pokud anonym, nebo nikdo, bude NULL
        table.integer("winner").nullable().defaultTo(null);
        table.foreign("winner").references("id").inTable("public.users").onDelete("SET NULL");

        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("ended_at");
    })
}

export const down = async function (knex) {
    await knex.schema.dropTable('games')
}