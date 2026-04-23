const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});