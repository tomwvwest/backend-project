const { getTopicsData } = require("../models/topics.model");

exports.getTopics = (req, res, next) => {
  getTopicsData().then((data) => {
    res.status(200).send(data);
  });
};
