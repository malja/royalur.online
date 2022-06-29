export const up = async function(knex) {
    await knex.schema.withSchema('public').table("user_tokens", (table) => {
        // Do kdy je možné tento token použít pro prvotní přihlášení
        table.timestamp( "first_login_until");
        // active_until => Do kdy je token platný pro všechna budoucí přihlášení (kromě prvního)
    });
};

export const down = async function(knex) {
    await knex.schema.withSchema("public").table("user_tokens", (table) => {
        table.dropColumn("first_login_until");
    })
}
