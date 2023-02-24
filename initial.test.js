describe("Example tests", function () {
  var stack = [];
  test("Should fire an example test", () => {
    stack.push(1);
    expect(stack.pop()).toEqual(1);
  });
});