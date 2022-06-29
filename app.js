import createError from "http-errors";
import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import logger from "morgan";

import page_router from "./routes/pages.js";
import api_router from "./routes/api.js";

import path from "path";

const json_parser = bodyParser.json()
const app = express();

// Nastavení šablon
app.set("views", [
  path.resolve() + "/views",
  path.resolve() + "/views/blocks",
  path.resolve() + "/views/mixins"
]);
app.set('view engine', 'pug');

// Registrace middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

// Registrace jednotlivých route
app.use('/', page_router);
app.use('/api', json_parser, api_router);

// Ošetření 404
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(error, request, response, next) {

  response.status(error.status || 500);

  response.render('error', {
    message: error.message,
    details: request.app.get('env') === 'development' ? error : {}
  });
});

// Spuštění aplikace
app.listen(3000, () => {
  console.log("Listening..");
});