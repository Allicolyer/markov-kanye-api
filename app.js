//import express
const express = require("express");
const app = express();

//import markov chain files
const kanyeQuotes = require("./scripts/formatted-quotes");
const { createMarkovChain, generateQuote } = require("./scripts/markov");

//allow origins to access
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Routes which should handle request
app.get("/kanyequotes", (req, res, next) => {
  res.send(kanyeQuotes);
});

app.get("/quote/:order", (req, res, next) => {
  const order = parseInt(req.params.order, 10);
  const markov = createMarkovChain(kanyeQuotes, order);
  res.json(generateQuote(markov));
});

app.get("/markov/:order", (req, res, next) => {
  const order = parseInt(req.params.order, 10);
  const markov = createMarkovChain(kanyeQuotes, order);
  res.json(markov);
});

app.get("/", (req, res, next) => {
  res.json(
    "Please try one of these routes /quote/:order, /markov/:order, /kanyequotes"
  );
});

//handles errors
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

//export app
module.exports = app;
