export async function getOpenGames(db) {
    return db("games")
        .where({open: true, public: true, active: true})
        .join("users", "games.player_1", "=", "users.id")
        .select(["games.token as token", "users.name as player", "users.elo as elo"])
        .orderBy("games.created_at", "DESC")
        .limit(10);
}
