const {
  getTopicsData,
  getEndpointsData,
  getArticleDataById,
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

exports.getArticlesById = (req, res, next) => {
  const id = req.params.article_id;
  getArticleDataById(id).then((result) => {
    res.status(200).send({ article: result });
  }).catch(next);
};
