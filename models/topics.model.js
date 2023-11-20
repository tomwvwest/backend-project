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
