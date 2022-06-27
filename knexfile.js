export default {
    client: "pg",
    connection: "postgresql://localhost:5432/malja",
    searchPath: ["database_schema"],
    migrations: {
        tableName: "knex_migrations",
        directory: "./migrations",
        schemaName: "public"
    },
}