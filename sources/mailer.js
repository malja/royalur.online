import nodemailer from "nodemailer";
import "dotenv/config";

const mail_transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secureConnection: false,
    tls: {
        ciphers: "SSLv3"
    },
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
});

export default mail_transport;