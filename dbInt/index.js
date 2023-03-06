const express = require('express');
const app = express();
//const router = express.Router();
app.use(express.json());
const { singleProduct } = require('./queries.js');

app.get('/', (req, res) => {
  res.send('It loads');
});

app.get('/products/:product_id', singleProduct)

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});

// module.exports.router = router;