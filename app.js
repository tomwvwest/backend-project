const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const app = express();

app.use(express.json());

app.get('/api/topics', getTopics)

//err handling
app.use((req, res, next) => {
  if(!req.status){
    res.status(404).send({msg: 'Route Not Found'})
  }
})

module.exports = app;
