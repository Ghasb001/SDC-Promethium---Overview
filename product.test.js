const { client } = require('./dbInt/db.js');
require("dotenv").config();

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
      var min = Math.ceil(1);
      var max = Math.floor(1000011);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    return client.query(`${process.env.styleString} = ${randomItem()};`)
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
  test("Runs largest query under 50 ms", () => {
    let randomItem = () => {
      var min = Math.ceil(1);
      var max = Math.floor(1000011);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const start = performance.now();
    return client.query(`${process.env.styleString} = ${randomItem()};`)
      .then(data => {
        const end = performance.now();
        expect(end - start).toBeLessThan(50);
      })
      .catch(err => console.log(err))
      .finally(() => { client.end(); })
  });
});