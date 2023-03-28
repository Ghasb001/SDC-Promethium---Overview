const { client } = require('./db.js');

const Redis = require('redis');
const cache = Redis.createClient(6379);

cache.connect()
.then(() => {
  console.log('Redis is Connected')
})
.catch(err => console.log(err))

// ALL the products (good luck)
const allProducts = (req, res) => {
  if (req.query.page === undefined) {
    req.query.page = 1;
  }
  if (req.query.count === undefined) {
    req.query.count = 5;
  }
  client.query(`SELECT * FROM productlist where product_id <= ${req.query.count}`)
  .then((list) => {
    res.status(200).json(list.rows);
  })
  .catch((err) => { res.sendStatus(500); throw err; });
}

// Single product API call
const singleProduct = (req, res) => {
  //console.log(singleFetch('1'))
  // singleFetch(req.params.product_id);
  cache.get(req.params.product_id.toString())
  .then ((store) => {
    if (store === null) {
      client.query(`SELECT * FROM productlist WHERE product_id = ${req.params.product_id}`)
      .then((productData) => {
        client.query(`SELECT feature, value FROM features WHERE product_id = ${req.params.product_id}`)
        .then((featureData) => {
          productData.rows[0].features = featureData.rows;
          //save the data into the cache
          cache.set(req.params.product_id, JSON.stringify(productData.rows[0]));
          //actually send the data
          res.status(200).json(productData.rows[0]);
        })
        .catch((err) => { throw err; });
      })
      .catch((err) => { res.sendStatus(500); throw err; });
    } else {
      res.status(200).json(JSON.parse(store));
    }
  })
  .catch(err => res.sendStatus(500))
};

// Single Product style API call
const productStlye = (req, res) => {
  var send = {product_id: req.params.product_id}
  client.query(`select s.style_id, s.name, s.sale_price, s.original_price, s.default_style as "default?", (select json_agg(p) as photos from (select photos.thumbnail_url, photos.url from photos where photos.style_id = s.style_id) as p),(select json_agg(skus) as skus from skus where s.style_id = skus.style_id) from styles as s where product_id = ${req.params.product_id};`)
    .then((products) => {
      let styles = products.rows;
      for (var i = 0; i < styles.length; i++) {
        let skus = styles[i].skus;
        let skuObj = {};

        if (skus) {
          for (var j = 0; j < skus.length; j++) {
            skuObj[skus[j].sku_id] = {
              size: skus[j].size,
              quantity: skus[j].quantity
            };
          }
        }
        skus = skuObj;
        styles[i].skus = skuObj;
      }
      send.results = styles;
      res.status(200).json(send);
    })
    .catch((err) => { res.sendStatus(500); throw err; });
};

// Related Product calls for a specific product
const relatedProducts = (req, res) => {
  client.query(`SELECT related_product_id FROM related WHERE product_id = ${req.params.product_id}`)
    .then((relatedData) => {
      var relatedArray = [];
      let relatedIds = relatedData.rows;
      relatedIds.forEach(x => { relatedArray.push(Object.values(x)[0])})
      res.status(200).json(relatedArray)
    })
    .catch((err) => { res.sendStatus(500); throw err; });
};

module.exports.allProducts = allProducts;
module.exports.singleProduct = singleProduct;
module.exports.productStlye = productStlye;
module.exports.relatedProducts = relatedProducts;