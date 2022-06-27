import mailer from "mailer.js";

export function sendLoginEmail(email_address, token) {
    mailer.sendMail({
        from: "login@royalur.online",
        to: email_address,
        subject: "Royal Game Of Ur Login",
        text: "Please use following link to login into game. https://royalur.online/login/" + token
    });
}