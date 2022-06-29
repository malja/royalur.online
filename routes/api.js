import express, {request, response} from "express";
import crypto from "crypto";

import db from "../db.js";
import {createUserName} from "../sources/user.js";
import {sendLoginEmail} from "../sources/mail.js";
import {nowPlusToTimestamp} from "../sources/tools.js";

const router = express.Router();

// Odeslání přihlašovacího e-mailu a případně vytvoření účtu, pokud ho hráč s tímto mailem ještě nemá
router.post("/users/login", async (request, response, next) => {

    // Kontrola očekávaného vstupu
    if (!("email" in request.body)) {
        console.log("No email");

        response.status(400).json({
           status: "error",
           errors: [
               {
                   "type": "value",
                   "title": "Empty e-mail",
                   "message": "Please fill in the e-mail address."
               }
           ],
           data: []
        });
    }

    const email = request.body.email;

    // Kontrola, jestli uživatel s tímto e-mailem ještě neexistuje
    let user = await db("users").withSchema("public")
        .select(["id", "enabled"])
        .where({"email": email})
        .limit(1);

    // První login, je třeba vytvořit uživatelský účet
    if (user.length === 0) {
        console.log("creating new!");
        await db("users").withSchema("public")
            .insert({
                "email": email,
                "name": createUserName()
            });
    }

    // Opět získá uživatele, teď už existuje
    user = await db("users").withSchema("public")
        .select(["id", "enabled"])
        .where({"email": email})
        .limit(1);

    user = user[0];

    const token_value = crypto.randomBytes(10).toString("hex");
    const token = await db("user_tokens").withSchema("public")
        .insert({
            user_id: user.id,
            token: token_value,
            // Dalších 5 minut
            first_login_until: nowPlusToTimestamp(5, "m"),
            // Další 1 den
            active_until: nowPlusToTimestamp(1, "d")
        });

    // TODO: Ošetření chyby

    const mail_result = sendLoginEmail(email, token_value)
    if (mail_result.rejected.length === 0) {
        return response.status(200).json({
            status: "success",
            errors: [],
            data: []
        });
    } else {
        return response.status(500).json({
            status: "error",
            errors: [
                "Unable to send login email."
            ],
            data: []
        });
    }
});

// Seznam nejlépe hrajících hráčů
router.get("/users/top", async (request, response, next) => {
    const players = await db("users").select(["name", "elo"]).orderBy("elo", "DESC").limit(10);

    response.status(200).json({
        status: "success",
        errors: [],
        data: players
    });
});

// Seznam aktuálně otevřených her, kam je možné se připojit
router.get("/games/open", async (request, response, next) => {
    const games = await getOpenGames(db);

    response.status(200).json({
        status: "success",
        errors: [],
        data: games
    });
});

// Vytvoření nové hry
router.post("/games", async (request, response, next) => {
   // TODO: Dodělat
});

// Připojení se k nové hře
router.get("/games/:token", async (request, response, next) => {
    
});


export default router;