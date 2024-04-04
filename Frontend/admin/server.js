//majd az user mappába kell ezt áthelyezni
//1. npm install express
//2. node server.js
//3. http://localhost:3001/user/index.html

const express = require('express');
const path = require('path');
const app = express();

app.use('/', express.static(path.join(__dirname, '../user')));

app.listen(42069, () => {
  console.log('Server is running on port 42069');
});