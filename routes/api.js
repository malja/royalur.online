import express, {request, response} from "express";
import crypto from "crypto";

import db from "../db.js";
import createUserName from "../sources/user.js";
import mailer from "../sources/mailer.js";

const router = express.Router();

// Odeslání přihlašovacího e-mailu a případně vytvoření účtu, pokud ho hráč s tímto mailem ještě nemá
router.post("/users/login", async (request, response, next) => {
    const req = request.body.json();

    // Kontrola očekávaného vstupu
    if (!req || !req.has("email")) {
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

    // Kontrola, jestli uživatel s tímto e-mailem ještě neexistuje
    let user = await db("users").select(["id", "enabled"]).where({email: req["email"]}).limit(1);

    // První login, je třeba vytvořit uživatelský účet
    if (user.length === 0) {
        user = await db("users").insert({
            "email": req["email"],
            "name": createUserName()
        });

        // TODO: Ošetření chyby, vzniku apod
    }

    const token_value = crypto.randomBytes(20).toString("hex");
    const token = await db("user_tokens").insert({
        token: token_value,
        // Dalších 5 minut
        use_until: Date.now() + 5 * 60 * 1000 * 1000,
        active_until: Date.now() + 25 * 60 * 1000 * 1000,
    });

    // TODO: Ošetření chyby

    await mailer.sendMail({
       from: env.MAIL_FROM,
       to: req["email"],
       subject: "Royal Game Of Ur: Login",
       text: "Use following link to login into Royal Game Of Ur: ...",
       html: "Use following link to login into Royal Game Of Ur: <a href=''>...</a>"
    });

    response.status(200).json({
        status: "success",
        errors: [],
        data: []
    });
});

// Přihlášení pomocí uživatelského tokenu, který uživatel získá z emailu
router.get("/users/login/:token", async (request, response, next) => {
    const token_value = request.params["token"];

    const token = await db("user_tokens").select("*").where({token: token_value});

    if (token.length !== 1 || token[0]["used"] === true || token[0]["active_until"] < Date.now() * 1000 ) {
        response.status(400).json({
            status: "error",
            errors: [
                {
                    type: "token not found",
                    title: "Token Does Not Exists",
                    message: "You provided token, that does not exists in our database. Please login again."
                }
            ],
            data: []
        });
        return;
    }

    response.status(200).json({
        status: "success",
        errors: [],
        data: [
            {
                "token": token[0]["token"]
            }
        ]
    });
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