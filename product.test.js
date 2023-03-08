const { client } = require('./dbInt/db.js');

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
  jest.setTimeout(60000);
  test("Single product query", () => {
    return client.query('SELECT * FROM productlist WHERE product_id = 1;')
      .then(data => {
        expect(data.rows[0].name).toBe('Camo Onesie');
      })
      .catch(err => console.log(err))
  });

  test("Single product style", async () => {
    await client.query('select s.style_id, s.name, s.sale_price, s.original_price, s.default_style as default, (select json_agg(p) as photos from (select photos.thumbnail_url, photos.url from photos where photos.style_id = s.style_id) as p),(select json_agg(skus) as skus from skus where s.style_id = skus.style_id) from styles as s where product_id = 71701')
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
        console.log('Error detected in the query')}
        )
      .finally(() => { client.end(); })
  });
});

