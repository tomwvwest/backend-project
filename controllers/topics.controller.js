const { checkArticleExists, checkExists } = require("../db/seeds/utils");
const {
  getTopicsData,
  getEndpointsData,
  getArticlesData,
  getArticleDataById,
  getCommentsDataByArticleId,
  addCommentToArticle,
  patchArticle,
  deleteCommentData,
  getUsersData,
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
  const topicQuery = req.query.topic;
  const articlePromises = [getArticlesData(topicQuery)];

  if (topicQuery) {
    articlePromises.push(checkExists("topics", "slug", topicQuery));
  }

  Promise.all(articlePromises)
    .then((results) => {
      res.status(200).send({ articles: results[0] });
    })
    .catch(next);
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
      const comments = results[0];
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const id = req.params.article_id;
  addCommentToArticle(id, req.body)
    .then(({ rows }) => {
      const comment = rows[0];
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const id = req.params.article_id;
  patchArticle(id, req.body)
    .then(({ rows }) => {
      res.status(200).send({ article: rows[0] });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const id = req.params.article_id;
  patchArticle(id, req.body)
    .then(({ rows }) => {
      res.status(200).send({ article: rows[0] });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const id = req.params.comment_id;
  deleteCommentData(id).then(() => {
    res.status(204).send()
  }).catch(next)
}

exports.getUsers = (req,res,next) => {
  getUsersData().then(users => {
    res.status(200).send({users})
  }).catch(next)
}