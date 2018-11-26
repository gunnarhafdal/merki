require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const stringify = require('csv-stringify/lib/sync');
const publish = require('./publish');

if(process.env.SECRET === undefined || process.env.SECRET === "") {
  console.log("SECRET missing from .env file. Quitting.");
  return
}

app.use(bodyParser.json());
app.use(express.static('public'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res, next) => res.sendFile('index.html'));

app.post('/add', (req, res, next) => {
  const secret = req.body.secret;
  
  if(secret !== process.env.SECRET) {
    res.sendStatus(403);
    return
  }

  const title = req.body.title;
  const url = req.body.url;
  const time = new Date().getTime();

  try {
    let line = stringify([[time,url,title]]);
    fs.appendFileSync('bookmarks.csv', line, 'utf8');
    publish.publish();
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(200);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});

