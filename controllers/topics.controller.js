const { checkArticleExists, checkExists } = require("../db/seeds/utils");
const {
  getTopicsData,
  getEndpointsData,
  getArticlesData,
  getArticleDataById,
  getCommentsDataByArticleId,
} = require("../models/topics.model");

exports.getEndpoints = (req, res, next) => {
  getEndpointsData().then((data) => {
    res.status(200).send({ apis: JSON.stringify(data) });
  });
};

exports.getTopics = (req, res, next) => {
  getTopicsData().then((data) => {
    res.status(200).send({ topics: data });
  });
};

exports.getArticles = (req, res, next) => {
  getArticlesData().then((data) => {
    res.status(200).send({articles: data});
  });
};
exports.getArticlesById = (req, res, next) => {
  const id = req.params.article_id;
  getArticleDataById(id)
    .then((result) => {
      res.status(200).send({ article: result });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const id = req.params.article_id;
  const articlePromises = [
    getCommentsDataByArticleId(id),
    checkExists("articles", "article_id", id),
  ];

  Promise.all(articlePromises)
    .then((results) => {
      const comments = results[0]
      res.status(200).send({ comments });
    })
    .catch(next);
};
