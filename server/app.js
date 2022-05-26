const express = require('express');

const app = express();

const port =  4000;

app.get('/', (req, res) => {
  res.status(200).send('iniciado');
});

app.listen(port);
console.log('puerto ', port);