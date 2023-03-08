const { client } = require('./db.js');

// ALL the products (good luck)

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
    .catch((err) => { res.sendStatus(404); throw err; });
};

// Single Product style API call
const productStlye = (req, res) => {
  client.query(`SELECT style_id, name, original_price, sale_price, default_style FROM styles WHERE product_id = ${req.params.product_id}`)
    .then((styleData) => {
      var send = {product_id: req.params.product_id};
      send.results = styleData.rows;
      var resultArray = send.results[0];
      // delete Object.assign(o, {[newKey]: o[oldKey] })[oldKey];
      delete Object.assign(resultArray, {['default?']: resultArray.default_style });
      delete resultArray.default_style;
      //res.status(200).json(send);
      send.results[0].photos = [];
      client.query(`SELECT thumbnail_url, url FROM photos WHERE style_id = ${resultArray.style_id}`)
      .then ((pics) => {
        pics.rows.forEach(p => {send.results[0].photos.push(p)})
        console.log(send);
        res.status(200).json(send);
      })
      .catch(err => {{ res.sendStatus(404); throw err; }})
    })
    .catch((err) => { res.sendStatus(404); throw err; });
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
    .catch((err) => { res.sendStatus(404); throw err; });
};

module.exports.singleProduct = singleProduct;
module.exports.productStlye = productStlye;
module.exports.relatedProducts = relatedProducts;