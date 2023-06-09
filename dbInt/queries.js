const { client } = require('./db.js');
const Redis = require('redis');
const cache = Redis.createClient(6379);

// Redis Connection
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
  // redis cache check //
  var pageCount = `PAGECOUNT${req.query.page}&${req.query.count}`;
  cache.get(pageCount)
    .then((list) => {
      if (list === null) {
        client.query(`SELECT * FROM productlist where product_id <= ${req.query.count}`)
          .then((list) => {
            res.status(200).json(list.rows);
            cache.set(pageCount, JSON.stringify(list.rows));
          })
          .catch((err) => { res.sendStatus(500); throw err; });
      } else {
        res.status(200).json(JSON.parse(list));
      }
    })
    .catch((err) => { res.sendStatus(500); throw err; });
}

// Single product API call
const singleProduct = (req, res) => {
  cache.get(`${req.params.product_id}SINGLE`)
    .then((store) => {
      if (store === null) {
        client.query(`select *, (select json_agg(f) as features from (select feature, value from features where features.product_id = productlist.product_id) as f) from productlist where product_id =${req.params.product_id};`)
          .then((productData) => {
            // send first, then save the data into the cache
            res.status(200).json(productData.rows[0]);
            cache.set(`${req.params.product_id}SINGLE`, JSON.stringify(productData.rows[0]));
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
  var send = { product_id: req.params.product_id };
  cache.get(`${req.params.product_id}STYLES`)
    .then((styleList) => {
      if (styleList === null) {
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
            // send first, then save the data into the cache
            res.status(200).json(send);
            cache.set(`${req.params.product_id}STYLES`, JSON.stringify(send));
          })
          .catch((err) => { res.sendStatus(500); throw err; });
      } else {
        res.status(200).json(JSON.parse(styleList));
      }
    })
    .catch((err) => { res.sendStatus(500); throw err; });

};

// Related Product calls for a specific product
const relatedProducts = (req, res) => {
  cache.get(`${req.params.product_id}RELATED`)
    .then((related) => {
      if (related === null) {
        client.query(`SELECT related_product_id FROM related WHERE product_id = ${req.params.product_id}`)
          .then((relatedData) => {
            var relatedArray = [];
            let relatedIds = relatedData.rows;
            relatedIds.forEach(x => { relatedArray.push(x.related_product_id) })
            // send first, then save the data into the cache
            res.status(200).json(relatedArray);
            cache.set(`${req.params.product_id}RELATED`, JSON.stringify(relatedArray));
          })
          .catch((err) => { res.sendStatus(500); throw err; });
      } else {
        res.status(200).json(JSON.parse(related));
      }
    })
    .catch((err) => { res.sendStatus(500); throw err; });
};

module.exports.allProducts = allProducts;
module.exports.singleProduct = singleProduct;
module.exports.productStlye = productStlye;
module.exports.relatedProducts = relatedProducts;