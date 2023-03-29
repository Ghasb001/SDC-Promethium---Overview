const express = require('express');
const app = express();
//const router = express.Router();
app.use(express.json());
const { allProducts, singleProduct, productStlye, relatedProducts } = require('./queries.js');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
  res.sendStatus(200);
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