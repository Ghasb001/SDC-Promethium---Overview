const { client } = require('./db.js');

const singleProduct = (req, res) => {
  client.query("SELECT * FROM productlist WHERE product_id = " + req.params.product_id + ';')
    .then((data) => {
      console.log(data.rows[0])
      res.status(200).json(data.rows[0]);
    })
    .catch((err) => { throw err; });
};

module.exports.singleProduct = singleProduct;