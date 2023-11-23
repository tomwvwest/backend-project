const db = require("../db/connection");
const fs = require("fs/promises");
const { checkExists } = require("../db/seeds/utils");

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
      return Promise.reject({ status: 404, msg: "article does not exist" });
    });
};

exports.getCommentsDataByArticleId = (id) => {
  return db
    .query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC",
      [id]
    )
    .then(({rows}) => {
      return rows;
    });
};

exports.getArticlesData = () => {
  return Promise.all([
    db.query("SELECT article_id FROM comments"),
    db.query("SELECT * FROM articles ORDER BY created_at DESC"),
  ]).then(([arrOfArticleAppearances, arrOfArticles]) => {
    const formattedArticleAppearances = arrOfArticleAppearances.rows.map(
      (obj) => obj.article_id
    );
    const arrOfArticlesRows = arrOfArticles.rows;
    arrOfArticlesRows.forEach((obj) => {
      delete obj.body;
      obj.comment_count = formattedArticleAppearances.filter(
        (num) => num === obj.article_id
      ).length;
    });
    return arrOfArticlesRows;
  });
};
