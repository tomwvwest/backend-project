const express = require("express");
const {
  getTopics,
  getEndpoints,
  getArticles,
  getArticlesById,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
} = require("./controllers/topics.controller");
const app = express();

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", patchArticleById);

//err handling
app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "Route Not Found" });
  next();
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) res.status(err.status).send({ msg: err.msg });
  next(err);
});

app.use((err, req, res, next) => {
  if(err.code) res.status(400).send({ msg: "Bad request" });
});

module.exports = app;
