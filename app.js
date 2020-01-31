//import express
const express = require("express");
const app = express();

//import markov chain files
const formatted_quotes = require("./scripts/formatted-quotes");
const { generate_map, generate_sentence } = require("./scripts/markov");

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
app.get("/quotes", (req, res, next) => {
  res.send(formatted_quotes);
});

app.get("/sentence/:order", (req, res, next) => {
  const order = parseInt(req.params.order, 10);
  const map = generate_map(formatted_quotes, order);
  res.json(generate_sentence(map));
});

app.get("/map/:order", (req, res, next) => {
  const order = parseInt(req.params.order, 10);
  const map = generate_map(formatted_quotes, order);
  res.json(map);
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
