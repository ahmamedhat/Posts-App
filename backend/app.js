const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');


app.use(express.json());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://ahmad:miO3wJt4bw4Xmhjz@cluster0.l9btu.mongodb.net/posts?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true}).then(()=> {

}).catch((err)=> {
  console.log('connection failed');
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

app.use('/images' , express.static(path.join('backend/images')));

app.use((req , res , next) => {
  res.setHeader('Access-Control-Allow-Origin' , '*');
  res.setHeader('Access-Control-Allow-Headers' , 'Origin , X-Requested-With , Content-Type , Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET , POST , PUT , PATCH , DELETE , OPTIONS');
  next();
});

app.use('/api/posts' , postsRoutes);

module.exports = app;