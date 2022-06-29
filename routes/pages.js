import express, {request, response} from "express";
import db from "../db.js";
import {getOpenGames} from "../sources/game.js";
import {getTopUsers} from "../sources/user.js";
import {nowToTimestamp, url} from "../sources/tools.js";

const router = express.Router();

router.get("/", async (request, response, next) => {
    console.log("Index handler");

    const open_games = await getOpenGames(db);
    const best_players = await getTopUsers(db);

    response.render("index.pug", {
        title: "Royal Game Of Ur",
        games: open_games,
        players: best_players
    });
});

router.get("/login", async (request, response, next) => {
   return response.render("login.pug");
});

router.get("/logout", async (request, response, next) => {
    response.clearCookie("user_token").render("logout.pug", {
        index_url: url("/")
    });
});

router.get("/login/:token", async (request, response, next) => {
   console.log("Token login handler");

   console.log("Received token", request.params.token);

   const token = await db("user_tokens").withSchema("public")
       .select(["token as value"])
       .where({token: request.params.token})
       .andWhere((b) => {
           b.where((builder) => {
               // Token nebyl použit a zároveň je ještě v limitu použití na první přihlášení
               builder.where({used: false}).andWhere("first_login_until", "<=", nowToTimestamp());
           }).orWhere((builder) => {
               // Token byl použit, a jeho použitelnost je stále v limitu pro opakované přihlášení
               builder.where({used: true}).andWhere("active_until", "<=", nowToTimestamp());
           });
       })
       .orderBy("created_at", "DESC")
       .limit(1);

    if (token.length === 0) {
       return response.render("login_with_token.pug", {
           status: "error"
       });
   }

   return response.cookie("user_token", token[0].value, {maxAge: 86400, httpOnly: true, secure: true })
       .append('Set-Cookie', 'user_token=' + token[0].value + ';')
       .render("login_with_token.pug", {
           status: "success"
       });
});

router.get("/start", async (request, response, next) => {
    // const token = request.cookies("user_token");

    return response.render("new_game.pug");
});

export default router;