const { dirname } = require("path");
const db = require("../db/connection");
const fs = require("fs/promises");

exports.getEndpointsData = () => {
  return fs.readFile(`${__dirname}/../endpoints.json`).then((result) => {
    return JSON.parse(result);
  });
};

exports.getTopicsData = () => {
  return db.query("SELECT * FROM topics").then((results) => {
    return results.rows;
  });
};

exports.getArticleDataById = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [id])
    .then((result) => {
      if (result.rows[0]) return result.rows[0];
      return Promise.reject();
    })
    .catch((err) => {
      if (err) return Promise.reject({ code: err.code });
      return Promise.reject({ status: 404, msg: "article does not exist" });
    });
};
