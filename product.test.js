const { client } = require('./dbInt/db.js');
require("dotenv").config();

const productString= "select * from productlist where product_id";
const styleString= "select s.style_id, s.name, s.sale_price, s.original_price, s.default_style as default, (select json_agg(p) as photos from (select photos.thumbnail_url, photos.url from photos where photos.style_id = s.style_id) as p),(select json_agg(skus) as skus from skus where s.style_id = skus.style_id) from styles as s where product_id";
const relatedString= "select * from related where product_id";

describe("Example tests", function () {
  var stack = [];
  test("Should fire an example test", () => {
    console.clear();
    stack.push(1);
    expect(stack.pop()).toEqual(1);
  });
});

describe("Connects to the database", function () {
  test('can connect to the products database', () => {
    expect(client.database).toBe('products')
  })
});

describe("Can make db queries", function () {
  // current testing timeout set to a minute in order to facilitate large searches
  test("Single product query", () => {
    return client.query('SELECT * FROM productlist WHERE product_id = 1;')
      .then(data => {
        expect(data.rows[0].name).toBe('Camo Onesie');
      })
      .catch(err => console.log(err))
  });

  test("Single product style", () => {
    let randomItem = () => {
      return Math.floor(Math.random() * (1000011 - 1 + 1)) + 1;
    }
    return client.query(`${styleString} = ${randomItem()};`)
      .then(data => {
        expect(data.rows.length).toBeGreaterThanOrEqual(1);
      })
      .catch(err => console.log(err))
  });

  test("Returns related products array", () => {
    return client.query('SELECT * FROM related WHERE product_id = 1;')
      .then(data => {
        expect(data.rows.length).toBeGreaterThanOrEqual(1);
      })
      .catch(err => console.log(err))
  });

  test("Error for an undefined product query", () => {
    var array = [];
    return client.query('SELECT * FROM productlist WHERE product_id = a;')
      .then(data => console.log(data))
      .catch(err => {
        expect(err.dataType).toBe(undefined);
        console.log('Error caught successfully')})
  });

});

describe("Speed tests", function () {
  var speedObj = {};
  let randomItem = () => {
    return Math.floor(Math.random() * (1000011 - 1 + 1)) + 1;
  }

  test("Runs list product query under 50 ms", () => {
    let current = randomItem();
    const start = performance.now();
    return client.query(`select * from productlist where product_id <= ${current + 5} and product_id >= ${current};`)
      .then(data => {
        const end = performance.now();
        expect(end - start).toBeLessThan(50);
        speedObj.list = (end - start)
      })
      .catch(err => console.log(err))
  });

  test("Runs single product query under 50 ms", () => {
    const start = performance.now();
    return client.query(`${productString} = ${randomItem()}`)
      .then(data => {
        const end = performance.now();
        expect(end - start).toBeLessThan(50);
        speedObj.singleProduct = (end - start)
      })
      .catch(err => console.log(err))
  });

  test("Runs related product query under 50 ms", () => {
    const start = performance.now();
    return client.query(`${relatedString} = ${randomItem()}`)
      .then(data => {
        const end = performance.now();
        expect(end - start).toBeLessThan(50);
        speedObj.related = (end - start)
      })
      .catch(err => console.log(err))
  });

  test("Runs style query under 50 ms", () => {
    const start = performance.now();
    return client.query(`${styleString} = ${randomItem()};`)
      .then(data => {
        const end = performance.now();
        expect(end - start).toBeLessThan(50);
        speedObj.styles = (end - start)
        console.log(speedObj)
      })
      .catch(err => console.log(err))
      .finally(() => { client.end(); })
  });
});