const express = require('express');
const app = express();
//const router = express.Router();
app.use(express.json());
const { singleProduct, relatedProducts, productStlye } = require('./queries.js');

app.get('/', (req, res) => {
  res.send('It loads');
});

// API Helper function calls
app.get('/products/:product_id', singleProduct)
app.get('/products/:product_id/styles', productStlye)
app.get ('/products/:product_id/related', relatedProducts)

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});

// module.exports.router = router;