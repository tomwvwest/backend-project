const { getTopicsData, getEndpointsData } = require("../models/topics.model");

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
  res.status(200).send()
};
