const express = require('express');
const app = express();
app.use(express.json());
const { allProducts, singleProduct, productStlye, relatedProducts } = require('./queries.js');
const bodyParser = require('body-parser');
const cors = require('cors');
require("dotenv").config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
  res.sendStatus(200);
});

// add the token to the env file to prevent DDOS
app.get(`/${process.env.loader}`, (req, res) => {
  res.send(`${process.env.loader}`);
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