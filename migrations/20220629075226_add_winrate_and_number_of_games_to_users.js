export const up = async function(knex) {
    await knex.schema.withSchema('public').table("users", (table) => {
        // Procentuální vyjádření vítězství
        table.decimal("winrate", 4, 2).defaultTo(0.0);
        // Celkový počet odehraných (až do konce) her
        table.integer("number_of_games").defaultTo(0);
    });
}

export const down = async function(knex) {
    await knex.schema.withSchema("public").table("users", (table) => {
        table.dropColumn("winrate");
        table.dropColumn("number_of_games");
    });

}


