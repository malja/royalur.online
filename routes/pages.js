import express, {request, response} from "express";
import pug from "pug";

import db from "../db.js";
import {getOpenGames} from "../sources/game.js";
import {getTopUsers} from "../sources/user.js";

const router = express.Router();

router.get("/", async (request, response, next) => {
    const template = pug.compileFile("./views/index.pug");
    const open_games = await getOpenGames(db);
    const best_players = await getTopPlayers(db);

    return template({
        title: "Royal Game Of Ur",
        games: open_games,
        players: best_players
    });
});

export default router;