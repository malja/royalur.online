import mail_transport from "./mailer.js";
import {url} from "./tools.js";
import "dotenv/config";

export async function sendLoginEmail(email_address, token) {
    return await mail_transport.sendMail({
        from: "login@royalur.online",
        to: email_address,
        subject: "Royal Game Of Ur Login",
        text: "Please use following link to login into game." + url("/" + token)
    });
}