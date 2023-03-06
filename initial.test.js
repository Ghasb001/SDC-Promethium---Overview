const { client } = require('./dbInt/db.js');

describe("Example tests", function () {
  var stack = [];
  test("Should fire an example test", () => {
    console.clear();
    stack.push(1);
    expect(stack.pop()).toEqual(1);
  });
});

describe("db connection", function () {

  test("Initial db connection", () => {
    var array = [];
    return client.query('select * from productlist where product_id = 1;')
      .then(data => { console.log(data.rows[0].name); return data.rows[0].name; })
      .catch(err => console.log(err))
      expect(data.rows[0].name).toBe('Camo Onesie');
  });
  client.end();
});

