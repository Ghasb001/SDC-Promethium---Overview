const express = require('express');
const app = express();
//const router = express.Router();
app.use(express.json());
const { allProducts, singleProduct, productStlye, relatedProducts } = require('./queries.js');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/', (req, res) => {
  res.send('It loads');
});

// API Helper function calls
app.get('/products', allProducts)
app.get('/products/:product_id', singleProduct)
app.post('/products/:product_id', singleProduct)
app.get('/products/:product_id/styles', productStlye)
app.get ('/products/:product_id/related', relatedProducts)

app.listen(1128, () => {
  console.log('Listening on port 1128!');
});

// module.exports.router = router;