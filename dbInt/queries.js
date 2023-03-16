const { client } = require('./db.js');

// ALL the products (good luck)
const allProducts = (req, res) => {
  if (req.params.page === undefined) {
    req.params.page = 1;
  }
  if (req.params.count === undefined) {
    req.params.count = 5;
  }
  client.query(`SELECT * FROM productlist where product_id <= ${req.params.count}`)
  .then((list) => {
    res.status(200).json(list.rows);
  })
  .catch((err) => { res.sendStatus(500); throw err; });
}

// Single product API call
const singleProduct = (req, res) => {
  client.query(`SELECT * FROM productlist WHERE product_id = ${req.params.product_id}`)
    .then((productData) => {
      client.query(`SELECT feature, value FROM features WHERE product_id = ${req.params.product_id}`)
      .then((featureData) => {
        productData.rows[0].features = featureData.rows;
        res.status(200).json(productData.rows[0]);
      })
      .catch((err) => { throw err; });
    })
    .catch((err) => { res.sendStatus(500); throw err; });
};

// Single Product style API call
const productStlye = (req, res) => {
  var send = {product_id: req.params.product_id}
  client.query(`select s.style_id, s.name, s.sale_price, s.original_price, s.default_style as "default?", (select json_agg(p) as photos from (select photos.thumbnail_url, photos.url from photos where photos.style_id = s.style_id) as p),(select json_agg(skus) as skus from skus where s.style_id = skus.style_id) from styles as s where product_id = ${req.params.product_id};`)
    .then((products) => {
      let styles = products.rows;
      console.log(styles)
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