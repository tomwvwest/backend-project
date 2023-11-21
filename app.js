const express = require("express");
const { getTopics, getEndpoints, getArticles } = require("./controllers/topics.controller");
const app = express();

app.use(express.json());

app.get("/api", getEndpoints)

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles)

//err handling
app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "Route Not Found" });
});

module.exports = app;
