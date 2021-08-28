const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const uuid = () => {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

// Set up Express
const PORT = process.env.PORT || 8080;

// Sets up the middleware to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname + './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  res.json(JSON.parse(fs.readFileSync(__dirname + '/db/db.json', (err, data) => {
    if(err){
      throw new Error(err)
    } else {
      return data;
      }})));
});

app.post('/api/notes', (req, res) => {
  const postRequest = req.body;
  postRequest.id = uuid();
  const dbArray = (JSON.parse(fs.readFileSync(__dirname + '/db/db.json', (err, data) => {
    if(err){
      throw new Error(err)
    } else {
      return data;
    }
  })));
  dbArray.push(postRequest);
  fs.writeFileSync(__dirname + '/db/db.json', JSON.stringify(dbArray), (err) => {throw new Error(err)})
  res.send("Success!")
});

app.delete('/api/notes/:id', (req, res) => {
  const deleteId = req.params.id;
  const dbArray = (JSON.parse(fs.readFileSync(__dirname + '/db/db.json', (err, data) => {
    if(err){
      throw new Error(err)
    } else {
      return data;
    }})));
  for(let i=0; i < dbArray.length; i++) {
    if(dbArray[i].id === deleteId) {
      dbArray.splice(i,1);
    }
  }
  fs.writeFileSync(__dirname + '/db/db.json', JSON.stringify(dbArray), (err) => {
    throw new Error(err)})
  res.send("Success!")
});

app.get('/*', (req,res) =>
  res.sendFile(path.join(__dirname + './public/index.html')));

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
