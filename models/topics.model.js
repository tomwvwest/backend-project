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

exports.getArticlesData = () => {
  // db.query('SELECT article_id')
  return db.query("SELECT * FROM articles").then(result => {
    const arrOfArticles = result.rows;
    arrOfArticles.forEach(obj => {
      delete obj.body;

      //const id = obj.article_id
      
    })
    return arrOfArticles
  }) 
}
