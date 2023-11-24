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
  return Promise.all([db
    .query("SELECT * FROM articles WHERE article_id = $1", [id]), db.query("SELECT article_id FROM comments")]) 
    .then(([articleResult, commentResult]) => {
      if (articleResult.rows[0]) {
        const article = articleResult.rows[0];
        const formattedArticleAppearances = commentResult.rows.map(
          (obj) => obj.article_id
        );

        article.comment_count = formattedArticleAppearances.filter((num) => num === 1).length;

        return article
      }
      return Promise.reject({ status: 404, msg: "article does not exist" });
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

exports.getCommentsDataByArticleId = (id) => {
  return db
    .query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC",
      [id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.addCommentToArticle = (id, obj) => {
  if (Object.keys(obj).length !== 2 || !obj.username || !obj.body) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return this.getArticleDataById(id).then((article) => {
    return db.query(
      "INSERT INTO comments (body, author, article_id, votes) VALUES ($1, $2, $3, $4) RETURNING *",
      [obj.body, obj.username, id, 0]
    );
  });
};

exports.patchArticle = (id, body) => {
  if(Object.keys(body).length !==1){
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return this.getArticleDataById(id).then((result) => {
    result.votes += body.inc_votes;
    return db.query('UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *', [result.votes, id])
  });
};

exports.deleteCommentData = (id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [id])
    .then((result) => {
      if (!result.rows[0]) return Promise.reject({ status: 404, msg: "comment does not exist" });
    });
};

exports.getUsersData = () => {
  return db.query('SELECT * FROM users').then(({rows}) => {
    return rows
  })
}
