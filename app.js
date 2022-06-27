import createError from "http-errors";
import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";

import page_router from "./routes/pages.js";
import api_router from "./routes/api.js";

const app = express();

// Nastavení šablon
app.set('views', 'views');
app.set('view engine', 'pug');

// Registrace middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

// Registrace jednotlivých route
app.use('/', page_router);
app.use('/api', api_router);

// Ošetření 404
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

// Spuštění aplikace
app.listen(3000, () => {
  console.log("Listening..");
});