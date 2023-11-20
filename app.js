const express = require("express");
const {
  getTopics,
  getEndpoints,
  getArticlesById,
} = require("./controllers/topics.controller");
const app = express();

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesById);

//err handling
app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "Route Not Found" });
  next();
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) res.status(err.status).send({ msg: err.msg });
  else if (err.code === "22P02") res.status(400).send({ msg: "Bad request" });
});

module.exports = app;